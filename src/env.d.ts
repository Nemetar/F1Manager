export {};

declare global {
  interface Window {
    telemetry: {
      onSpeed: (callback: (speed: number) => void) => void;
    };
  }
}
