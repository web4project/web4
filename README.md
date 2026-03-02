<div align="center">
  <img src="./public/logo.png" alt="Web4Project logo" width="96" height="96" />

  ## Web4Project (Web4)

  **A private, end-to-end encrypted, offline-first memory vault that runs entirely in your browser.**

  No accounts. No servers. No tracking. Your vault stays on your device (IndexedDB) and can be exported/imported as an encrypted backup.
</div>

---

<div align="center">
  <img src="./preview.PNG" alt="Web4Project preview" />
</div>

---

## Features

- **End-to-end encrypted**: Items are encrypted on-device using **Argon2id** (key derivation) + **XSalsa20-Poly1305** (authenticated encryption).
- **Offline-first**: After the first load, the app works fully offline.
- **Zero backend**: Runs as a static site—no database server, no API keys, no user accounts.
- **Portable vault**: Export an **encrypted** backup file and import it on any device.
- **Fast search**: Local full-text search without sending data anywhere.

## Tech stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Routing**: React Router
- **Storage**: IndexedDB (Dexie)
- **Crypto**: libsodium (Argon2id + XSalsa20-Poly1305)
- **PWA**: `vite-plugin-pwa` + Workbox

## Quick start (run locally)

**Prerequisites**
- Node.js **18+** recommended
- npm (comes with Node)

**Install & run**

```bash
cd web4
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

## Build & preview

```bash
cd web4
npm run build
npm run preview
```

## Scripts

- **dev**: start the development server
- **build**: production build
- **preview**: preview the production build locally
- **lint**: run ESLint
- **typecheck**: run TypeScript type checking

## How data is stored

- **Local-only by default**: Your encrypted vault is stored in **IndexedDB** on your device.
- **No telemetry**: No analytics, cookies, or tracking baked in.

## Security notes (high level)

- **Your passphrase stays on your device**.
- **Encryption happens before storage** (and before any export).
- If you forget your passphrase, **there is no recovery** (by design).

More details: see `docs/SECURITY_MODEL.md`.

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` first.

## License

MIT (see `LICENSE`).
