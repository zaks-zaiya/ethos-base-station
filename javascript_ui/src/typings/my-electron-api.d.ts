// Patch window to include myElectronAPI
// this is defined in `/src-electron/electron-preload.ts`
declare module 'my-electron-api' {
  global {
    interface Window {
      myElectronAPI?: {
        quit: () => void;
      };
    }
  }
}
