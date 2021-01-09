import { app, BrowserWindow } from "electron";
import { join } from 'path';
const dev = process.env.NODE_ENV !== "production";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  });


  if (dev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadFile(`${join(__dirname, '../build/index.html')}`)
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});