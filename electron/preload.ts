import { contextBridge, ipcRenderer } from 'electron';

type SpeedCallback = (speed: number) => void;

declare global {
  interface Window {
    electronAPI: {
      onSpeedUpdate: (callback: SpeedCallback) => () => void;
    };
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  onSpeedUpdate: (callback: SpeedCallback) => {
    const listener = (_event: Electron.IpcRendererEvent, speed: number) => {
      callback(speed);
    };

    ipcRenderer.on('telemetry:speed', listener);

    return () => {
      ipcRenderer.removeListener('telemetry:speed', listener);
    };
  }
});
