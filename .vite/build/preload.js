"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("telemetry", {
  onSpeed: (callback) => {
    electron.ipcRenderer.on("telemetry:speed", (_event, speed) => {
      callback(speed);
    });
  }
});
