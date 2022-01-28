// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld("ipcRenderer", {
  ...ipcRenderer, on: (event, callback) => {
    ipcRenderer.on(event, callback)
  }
})
