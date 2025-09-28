/// <reference types="vite/client" />

declare interface Window {
  electronAPI?: {
    onSpeedUpdate: (callback: (speed: number) => void) => () => void;
  };
}
