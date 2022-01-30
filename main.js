// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, contextBridge, ipcRenderer } = require('electron')
const path = require('path')
const { runCmd } = require('./cmdRunner')
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    // maxHeight: 300,
    // maxWidth: 300,
    transparent: true,
    width: 500,
    height: 500,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.setWindowButtonVisibility(false)
  // mainWindow.setAspectRatio(1.6)
  // mainWindow.setIgnoreMouseEvents(true)
  mainWindow.loadFile('index.html')
  // and load the index.html of the app.
  // ipcMain.emit('window-info', {
  //   argv: process.argv
  // })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    console.log("active")
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('onload', (event, arg) => {
  console.log('onload')
  console.log('argv', process.argv)
  event.sender.send('window-info', {
    argv: process.argv,
    pwd: process.cwd()
  })
})

ipcMain.on('cmd', (event, arg) => {
  console.log(arg)
  runCmd(arg.cmd, arg.dir, {
    onClose: () => {
      event.sender.send('cmd-close')
    },
    onData: (data) => {
      const str = data.toString()
      event.sender.send('cmd-data', str)
    }
  })
  // createWindow()
  // console.log("click in main process")
  // event.sender.send('click1', "7777")
})

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
