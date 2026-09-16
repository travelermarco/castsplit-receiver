# CastSplit Receiver

A custom Chromecast Web Receiver for [CastSplit](https://github.com/travelermarco/CastSplit). Its sole purpose is to let the Cast device rewrite the HTTP headers (Referer, Cookie, User-Agent) on every network request it makes, so that casting still works against streaming sites that protect their video files by checking that the request carries the same headers as the browser the user navigated from. Without this, the Cast device receives an empty/incomplete response and gets stuck buffering forever, even though the same URL plays fine in a phone browser.

The CastSplit app sends the headers to use inside the Cast `LOAD` message (`media.customData.headers`); this receiver reads them and reapplies them to every network request the player makes (manifest, media segments, and DRM license requests).

## Features

- Intercepts the Cast Application Framework (CAF) `LOAD` message and extracts custom headers from `media.customData.headers`.
- Reapplies those headers to manifest requests, media segment requests, and license (DRM) requests via `PlaybackConfig` request handlers.
- Minimal, dependency-free implementation (no build step, no bundler).

## Tech stack

- Google Cast Application Framework (CAF) Receiver SDK v3 (`cast_receiver_framework.js`, loaded from Google's CDN)
- Plain HTML + vanilla JavaScript (`index.html`, `receiver.js`)
- No package manager, no build tooling, no dependencies

## Setup / Deployment

This is a static, two-file Cast receiver app with no build process:

- `index.html` — loads the CAF SDK and `receiver.js`
- `receiver.js` — the receiver logic described above

It is published as a static site via GitHub Pages at `https://travelermarco.github.io/castsplit-receiver/`. To register it as a custom receiver, add its GitHub Pages URL as a Custom Receiver Application in the [Google Cast Developer Console](https://cast.google.com/publish), then point the CastSplit sender app at the resulting Application ID.

See `docs/receiver-cast-personalizzato.md` in the main [CastSplit](https://github.com/travelermarco/CastSplit) repo for the full registration walkthrough.

## Notes / Caveats

- This is a personal/internal companion project for CastSplit, not a general-purpose receiver.
- Deployment is via GitHub Pages serving the repo's static files directly — there is no CI/CD pipeline or build step.
- The receiver only rewrites headers it receives from the sender app in the `LOAD` message; it has no header logic of its own.
