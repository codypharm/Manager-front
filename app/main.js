/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";

const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  remote,
  dialog
} = require("electron");
//const Database = require("../src/js/db");
const Store = require("../src/js/store");
//const { CATCH_ON_MAIN } = require("../utils/constants");
var force_quit = false;

//enable the use of css grid
app.commandLine.appendSwitch("enable-experimental-web-platform-features");

//instantiate classes
//const db = new Database();
const store = new Store();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minHeight: 500,
    minWidth: 700,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // force log user out
  store.forceLogout();

  //load
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.maximize();
  mainWindow.on("close", function() {
    //   <---- Catch close event
    mainWindow.webContents.send("window-close", "Mark");
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

/*ipcMain.on(CATCH_ON_MAIN, (event, arg) => {
  let n = new Notification({
    title: "Synchronization Report",
    body: arg
  }).show();
});*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // eslint-disable-next-line no-undef
  if (process.platform !== "darwin") {
    // eslint-disable-line
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
