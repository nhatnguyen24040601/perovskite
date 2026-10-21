/**
 * `npm run dev:remote`: dev server + a public Cloudflare quick tunnel, so the iPhone remote
 * works from any network (cellular, a different Wi-Fi). Prints the address and PIN to type
 * into the app.
 *
 * Needs `cloudflared` (brew install cloudflared). A PIN is always set, because the tunnel
 * address is reachable from the internet; through it only /__remote/* is served
 * (see scripts/remote-control-plugin.mjs).
 */
import { spawn, spawnSync } from "node:child_process";
import { randomInt } from "node:crypto";

const PORT = 8080;

if (spawnSync("cloudflared", ["--version"], { stdio: "ignore" }).status !== 0) {
  console.error(
    [
      "cloudflared is not installed.",
      "  brew install cloudflared      (then run `npm run dev:remote` again)",
      "Or use Tailscale on the Mac and the iPhone: no tunnel needed, see README.md.",
    ].join("\n"),
  );
  process.exit(1);
}

const pin = process.env.REMOTE_PIN || String(randomInt(100000, 1000000));
const children = [];
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill("SIGTERM");
  process.exit(code);
}
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

const dev = spawn("npm", ["run", "dev"], { stdio: "inherit", env: { ...process.env, REMOTE_PIN: pin } });
children.push(dev);
dev.on("exit", (code) => stop(code ?? 1));

const tunnel = spawn("cloudflared", ["tunnel", "--no-autoupdate", "--url", `http://localhost:${PORT}`], {
  stdio: ["ignore", "ignore", "pipe"],
});
children.push(tunnel);
tunnel.on("exit", (code) => {
  if (!stopping) console.error(`cloudflared stopped (exit ${code}). The remote only works on the same Wi-Fi now.`);
});

let announced = false;
let buffer = "";
tunnel.stderr.on("data", (chunk) => {
  buffer += chunk.toString("utf8");
  const match = buffer.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  if (!match || announced) return;
  announced = true;
  const line = "─".repeat(54);
  console.log(`\n${line}\n  iPhone remote, works from any network\n  Address: ${match[0]}\n  PIN:     ${pin}\n${line}\n`);
});
