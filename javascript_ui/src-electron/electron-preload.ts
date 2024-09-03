/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcRenderer } from 'electron';
import { app } from '@electron/remote';

contextBridge.exposeInMainWorld('myElectronAPI', {
  quit() {
    app.quit();
  },
  send: (channel: string, data: any) => {
    const validChannels = ['set-system-time', 'sleep-device'];
    if (validChannels.includes(channel)) {
      console.log(`Sending ${channel} command to electron with data: ${data}`);
      ipcRenderer.send(channel, data);
    } else {
      console.error('Invalid electron command:', channel);
    }
  },
  on: (channel: string, func: any) => {
    const validChannels = ['set-system-time-response', 'sleep-device-response'];
    if (validChannels.includes(channel)) {
      // Use a wrapper to call the passed function
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
