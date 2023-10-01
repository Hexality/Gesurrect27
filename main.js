const { app, ipcMain, systemPreferences, shell } = require("electron");
const { MicaBrowserWindow } = require("mica-electron");
const AccentColors = require("windows-accent-colors");
const path = require("node:path");

const nW = () => {
  const mW = new MicaBrowserWindow({
    minWidth: 1000,
    width: 1000,
    minHeight: 720,
    height: 720,
    /* frame: false, */
    titleBarStyle: "hidden",
    /* titleBarOverlay: {
      height: 48,
      width: 48
    }, */
    webPreferences: {
      preload: path.join(__dirname, "src", "scripts", "preload.js"),
    },
    show: false,
  });

  mW.setAutoTheme();
  mW.setMicaEffect();

  ipcMain.handle("is-maximized", async () => mW.isMaximized());
  ipcMain.handle("minimizeWindow", () => mW.minimize());
  ipcMain.handle("maximizeWindow", () => mW.maximize());
  ipcMain.handle("restoreWindow", () => mW.unmaximize());
  ipcMain.handle("closeWindow", () => mW.close());

  ipcMain.handle("open-link", (ev, lk) => {
    const link =
      {
        github: "https://github.com/Hexality/Gesurrect27",
        feedback: "https://github.com/Hexality/Gesurrect27/issues",
        help: "https://discord.com/users/422274807732633604",
      }[lk] ?? null;
    shell.openExternal(link);
  });

  ipcMain.handle("get-accent", () => {
    const accents = AccentColors.getAccentColors();
    return accents;
  });

  /* mW.loadFile('app.html') */
  mW.loadURL("http://127.0.0.1:3000/");

  // mW.webContents.openDevTools()

  mW.show();
};

app.whenReady().then(() => {
  nW();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) nW();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
