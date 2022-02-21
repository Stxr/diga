// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const { runCmd } = require('./cmdRunner')
const { createMenu } = require('./menu')
const { getStoreKey } = require('./tools/hash')
const store = require('./tools/store')
function createWindow(params = { argv: process.argv.slice(1), pwd: process.cwd(), title: '' }) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    // maxHeight: 300,
    // maxWidth: 300,
    transparent: true,
    width: 200,
    height: 100,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.setWindowButtonVisibility(false)
  // mainWindow.setAspectRatio(1.6)
  // mainWindow.setIgnoreMouseEvents(true)
  mainWindow.loadFile('index.html')
  // mainWindow.webContents.send('window-info', {
  //   argv: process.argv.slice(1),
  //   pwd: process.cwd(),
  //   title: '666'
  // })
  mainWindow.webContents.on('ipc-message', (event, channel, args) => {
    console.log('ipc-message:', channel, args)
    event.sender.send('window-info', {
      argv: params.argv,
      pwd: params.pwd,
      title: params.title
    })
  })

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
  const appMenu = Menu.buildFromTemplate(createMenu(app))
  Menu.setApplicationMenu(appMenu)
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

ipcMain.on('save', (event, arg) => {
  console.log('save:', arg)
  const { cmd, dir, title } = arg
  const key = getStoreKey(cmd, dir)
  store.addStorageKey(key)
  store.set(key, {
    cmd,
    dir,
    title
  })
})

ipcMain.on('create', (event, arg) => {
  createWindow({
    argv: "ls -l",
    pwd: process.cwd(),
    title: arg.title
  })
  const key = getStoreKey(arg.cmd, arg.dir)
  const data = store.get(key)
  console.log(data)
  console.log(store.getStorageKeys())
})

ipcMain.on('cmd', (event, arg) => {
  console.log(arg)
  const cmd = arg.cmd
  if (cmd) {
    runCmd(cmd, arg.dir, {
      onClose: () => {
        event.sender.send('cmd-close')
      },
      onData: (data) => {
        const str = data.toString()
        event.sender.send('cmd-data', str)
      }
    })
  } else {
    console.log(`cmd is ${cmd}`)
    event.sender.send('cmd-close')
  }
})

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
