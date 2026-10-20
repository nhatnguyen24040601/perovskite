# Perovskite presentation + iPhone remote

Two parts:

| Folder | What it is |
| --- | --- |
| `perovskite/` | The presentation itself: a web app (Vite + React + three.js) you show on the big screen. |
| `remote_control/` | An iOS app (SwiftUI) that turns your iPhone into a clicker with speaker notes. |

The phone never talks to the browser directly. It talks to a small relay built into the
`perovskite` dev server, and the deck page listens to that relay:

```
iPhone app ──POST /__remote/cmd──▶ dev server ──SSE──▶ deck in the browser
iPhone app ◀──SSE (slide state)─── dev server ◀──POST── deck in the browser
```

Because the relay lives in the dev server, **the remote only works with `npm run dev`**, not with
the deployed Vercel build.

## Requirements

- Mac with Node.js 22 or newer (developed on Node 26) and npm
- Xcode 27 (the iOS project targets iOS 27.0) and an iPhone, or the iOS Simulator
- Mac and iPhone on the **same Wi-Fi network**

## 1. Run the presentation

```sh
cd perovskite
npm install        # first time only
npm run dev
```

The terminal prints something like:

```
[remote] iPhone app address: http://10.81.3.52:8080  or  http://198.18.0.1:8080
➜  Local:   http://localhost:8080/
➜  Network: http://10.81.3.52:8080/  en0
```

Open `http://localhost:8080/` in the browser on the machine connected to the projector.
The port is fixed to 8080; if something else already uses it the server refuses to start
(see Troubleshooting).

Deck keyboard shortcuts (without the phone): `←` / `→` previous / next step, `Space` play or
pause, `R` replay, `E` notes, `[` toggle the side menu.

Press the browser's fullscreen (`F11` or the Present button) once on the Mac before you start.
A browser only allows fullscreen from a click on the page itself, so the phone cannot do it.

## 2. Run the iPhone app

1. Open `remote_control/remote_control.xcodeproj` in Xcode.
2. Select the `remote_control` scheme and your iPhone (or an iPhone simulator) as the destination.
3. For a real iPhone: Signing & Capabilities → pick your own Team (the project currently has a
   team ID set that is probably not yours), and trust the developer certificate on the phone
   under Settings → General → VPN & Device Management if iOS asks.
4. Press Run (`⌘R`).
5. On first launch iOS asks for **local network access**. Allow it, otherwise the app cannot
   reach the Mac.
6. In the app's Connection screen enter the address printed by the dev server, for example
   `10.81.3.52:8080` (use the `en0`/Wi-Fi address, not the `198.18.x.x` one), then tap Connect.
   `http://` and the port are optional; the port defaults to 8080.

The dot at the top of the app tells you the state:

- **Green, "Deck connected"**: working. The deck tab is open and the phone is in sync.
- **Orange, "Open the deck in the browser"**: the server is reachable, but no deck tab is open.
- **Red**: the server cannot be reached (wrong address, different Wi-Fi, server not running)
  or the PIN is wrong.

### Using the app

- **Next / Back** big buttons, or swipe left / right on the slide card.
- **Step menu** (top of the card) jumps to a step inside the current slide.
- **Transport row**: previous slide, play / pause, replay, next slide, and the slide list
  to jump to any slide.
- **Card text** is the current step's text, shown as your speaker notes.
- **Timer** at the top counts up from app start; tap it to reset.
- **Toggles**: notes, dark mode, present layout, Vietnamese / English, 3D spin, text size,
  photos, side menu. Labels / Slow / Auto only apply to the 3D story slides and are greyed out
  on other slides.

## If the connection drops

The app reconnects by itself: it reopens the link after 20 seconds of silence, straight away when
the Wi-Fi changes or comes back, and when you reopen the app. Taps are retried up to 3 times, and the
server ignores a repeated tap, so a slide is never skipped twice. If it still looks stuck, tap the
status dot at the top left to force a reconnect.

## Optional: PIN

Anyone on the same network can drive the deck while the dev server is running. On a shared
network (a conference, a campus) start the server with a PIN and enter the same PIN in the app:

```sh
REMOTE_PIN=1234 npm run dev
```

## Stop the server

`Ctrl+C` in the terminal running `npm run dev`. If it was started in the background:

```sh
lsof -iTCP:8080 -sTCP:LISTEN     # find the PID
kill <PID>
```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm run dev` fails with "Port 8080 is already in use" | Stop the old server (see above) and start again. |
| App stays red | Phone and Mac must be on the same Wi-Fi. Check the address matches the `[remote]` line, and that the Mac firewall allows incoming connections for Node. Some guest or hotel networks block device-to-device traffic: use your phone's hotspot or a personal router instead. |
| App says "Wrong PIN" | The server was started with `REMOTE_PIN`; enter exactly that value in the Connection screen. |
| Orange dot even though the deck is open | Reload the deck tab. The tab must be opened from the dev server (`http://localhost:8080`), not a deployed copy. |
| No local-network prompt, app cannot connect | iOS Settings → Privacy & Security → Local Network → enable `remote_control`. |

## What was added for the remote

- `perovskite/scripts/remote-control-plugin.mjs`: the relay (`/__remote/*`), dev server only.
- `perovskite/src/lib/sim/remote.ts`: applies phone commands to the deck and reports its state.
- `remote_control/`: the SwiftUI app (`RemoteClient.swift` is the networking, `ContentView.swift` the UI).
