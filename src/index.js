import { app, BrowserWindow, Menu } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import path from 'path'
// Keep a global reference of the window object, if you don't, the window will

require('electron-debug')()
require('electron-context-menu')()
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let isQuitting = false

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload();

const appMenu = require('./menu')
const config = require('./config')
const pkg = require('./package')
// Set title of the app that will use shown in window titlebar
app.setName(pkg.productName)

// Just one app
const isAlreadyRunning = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    mainWindow.show()
  }
})

if (isAlreadyRunning) {
  app.quit()
}

const createMainWindow = async () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(VUEJS_DEVTOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('close', e => {
    if (!isQuitting) {
      e.preventDefault()

      if (process.platform === 'darwin') {
        app.hide()
      } else {
        app.quit()
      }
    }
  })
};

app.on('ready', () => {
  Menu.setApplicationMenu(appMenu)
  mainWindow = createMainWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  isQuitting = true

  if (!mainWindow) {
    config.set('lastWindowState', mainWindow.getBounds())
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
