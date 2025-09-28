import { app, BrowserWindow, shell } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { startUdpListener } from './udp-listener';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = app.isPackaged ? 'production' : 'development';
}

const isDev = process.env.NODE_ENV !== 'production';

let stopListener: (() => void) | null = null;

const resolvePreloadPath = () => {
  const candidates = [
    path.join(__dirname, 'preload.js'),
    path.join(__dirname, '../electron/preload.js'),
    path.join(__dirname, 'preload.ts'),
    path.join(__dirname, '../electron/preload.ts')
  ];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found ?? path.join(__dirname, 'preload.js');
};

const createWindow = () => {
  const preloadPath = resolvePreloadPath();

  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    backgroundColor: '#0b1120',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' }).catch(() => undefined);
  }

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  const indexHtmlPath = path.join(__dirname, '../dist/index.html');

  if (isDev && devServerUrl) {
    win.loadURL(devServerUrl).catch((error) => {
      console.error('Failed to load renderer', error);
    });
  } else if (fs.existsSync(indexHtmlPath)) {
    win.loadFile(indexHtmlPath).catch((error) => {
      console.error('Failed to load renderer file', error);
    });
  } else {
    const fallbackUrl = 'http://localhost:5173';
    win.loadURL(fallbackUrl).catch((error) => {
      console.error('Failed to load fallback renderer URL', error);
    });
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url).catch(() => undefined);
    return { action: 'deny' };
  });

  stopListener = startUdpListener(win);

  return win;
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (stopListener) {
    stopListener();
    stopListener = null;
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
