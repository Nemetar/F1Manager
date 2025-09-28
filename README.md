# F1 Manager Telemetry Viewer

An Electron + Vue 3 desktop application that listens to F1 25 UDP telemetry packets and visualises the live car speed with a modern TailwindCSS UI.

## Getting Started

```bash
npm install
npm run dev
```

This starts the Vite development server and launches the Electron window. Make sure F1 25 is configured to broadcast telemetry to `0.0.0.0:20777`.

## Building

```bash
npm run build
```

The build command bundles the Vue frontend and compiles the Electron main process into `dist-electron/`.
