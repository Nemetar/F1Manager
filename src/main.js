import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { F1TelemetryClient, constants } from '@deltazeroproduction/f1-udp-parser';

const { PACKETS } = constants;

if (started) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.openDevTools();

  // 🚀 Start telemetry client
  startTelemetry();
};

function startTelemetry() {
  const client = new F1TelemetryClient({ port: 20777 });

  // Exemple : vitesse (carTelemetry)
  client.on(PACKETS.carTelemetry, (data) => {
    const speed = data.m_carTelemetryData?.[0]?.m_speed;
    if (mainWindow && typeof speed === 'number') {
      mainWindow.webContents.send('telemetry:speed', speed);
    }
  });

  client.start();

  console.log('[UDP] Listening on port 20777');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
