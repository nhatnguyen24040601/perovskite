/**
 * Dev-server relay for the iOS "remote_control" app.
 *
 *   phone  --POST /__remote/cmd-->  server  --SSE role=deck-->    browser (the deck)
 *   phone  <--SSE role=remote----   server  <--POST /__remote/state--  browser
 *
 * The deck page (src/lib/sim/remote.ts) applies commands to the zustand store and
 * posts back a snapshot (current slide, step, notes, toggles, outline). The server
 * keeps only the latest snapshot so a phone that connects late is up to date.
 *
 * Optional pairing PIN: start the server with REMOTE_PIN=1234 and enter the same
 * PIN in the app. Without it anyone on the same network can drive the deck.
 */
import { networkInterfaces } from "node:os";

const PREFIX = "/__remote";
const MAX_BODY = 256 * 1024;

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

function lanAddresses() {
  const out = [];
  for (const list of Object.values(networkInterfaces())) {
    for (const info of list ?? []) {
      if (info.family === "IPv4" && !info.internal) out.push(info.address);
    }
  }
  return out;
}

export function remoteControlPlugin() {
  const pin = process.env.REMOTE_PIN || "";
  /** @type {Set<import("node:http").ServerResponse>} */
  const decks = new Set();
  /** @type {Set<import("node:http").ServerResponse>} */
  const remotes = new Set();
  let snapshot = null;
  /** Recent command ids, oldest first. */
  const seenIds = new Set();

  const frame = (event, data) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const broadcast = (set, event, data) => {
    const text = frame(event, data);
    for (const res of set) res.write(text);
  };
  const status = () => ({ deck: decks.size > 0, remotes: remotes.size });

  function openStream(req, res, set, hello) {
    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    });
    res.write(": connected\n\n");
    set.add(res);
    if (hello) res.write(hello);
    const beat = setInterval(() => res.write(": ping\n\n"), 15000);
    req.on("close", () => {
      clearInterval(beat);
      set.delete(res);
      broadcast(remotes, "status", status());
    });
    broadcast(remotes, "status", status());
  }

  return {
    name: "app-builder:remote-control",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (!url.pathname.startsWith(`${PREFIX}/`)) {
          next();
          return;
        }
        const route = url.pathname.slice(PREFIX.length);
        const method = (req.method ?? "GET").toUpperCase();

        // The deck page is served from this origin and is trusted; every other client needs the PIN.
        const fromDeck = route === "/events" && url.searchParams.get("role") === "deck";
        const fromDeckPost = route === "/state";
        if (pin && !fromDeck && !fromDeckPost) {
          const given = req.headers["x-remote-pin"] ?? url.searchParams.get("pin");
          if (given !== pin) {
            sendJson(res, 401, { error: "bad pin" });
            return;
          }
        }

        try {
          if (route === "/ping" && method === "GET") {
            sendJson(res, 200, { ok: true, pin: Boolean(pin), ...status() });
          } else if (route === "/events" && method === "GET") {
            if (url.searchParams.get("role") === "deck") {
              openStream(req, res, decks, null);
            } else {
              const hello = snapshot ? frame("state", snapshot) : null;
              openStream(req, res, remotes, hello);
              res.write(frame("status", status()));
            }
          } else if (route === "/cmd" && method === "POST") {
            const cmd = await readJson(req);
            if (typeof cmd.cmd !== "string") {
              sendJson(res, 400, { error: "cmd required" });
              return;
            }
            // The phone retries on a flaky link and reuses the id, so a repeat must not advance the slide twice.
            if (typeof cmd.id === "string") {
              if (seenIds.has(cmd.id)) {
                sendJson(res, 200, { ok: true, deck: decks.size > 0, duplicate: true });
                return;
              }
              seenIds.add(cmd.id);
              if (seenIds.size > 200) seenIds.delete(seenIds.values().next().value);
            }
            broadcast(decks, "cmd", cmd);
            sendJson(res, 200, { ok: true, deck: decks.size > 0 });
          } else if (route === "/state" && method === "POST") {
            const body = await readJson(req);
            // The outline is large and rarely changes: the deck sends it once per connection.
            snapshot = { ...body, outline: body.outline ?? snapshot?.outline };
            broadcast(remotes, "state", snapshot);
            sendJson(res, 200, { ok: true });
          } else {
            sendJson(res, 404, { error: "not found" });
          }
        } catch (err) {
          sendJson(res, 400, { error: String(err instanceof Error ? err.message : err) });
        }
      });

      server.httpServer?.once("listening", () => {
        const addr = server.httpServer?.address();
        const port = typeof addr === "object" && addr ? addr.port : 8080;
        const urls = lanAddresses().map((ip) => `http://${ip}:${port}`);
        if (urls.length === 0) return;
        console.log(`\n  [remote] iPhone app address: ${urls.join("  or  ")}${pin ? "  (PIN required)" : ""}\n`);
      });
    },
  };
}
