const { app, ipcMain, shell, ipcRenderer } = require("electron");
const { MicaBrowserWindow } = require("mica-electron");
const AccentColors = require("windows-accent-colors");
const Store = require("electron-store");
const wheel = require("logitech-g27");
const path = require("node:path");
const { error } = require("node:console");

const schema = {
  wheelRange: {
    type: "number",
    default: 270,
  },
};

const store = new Store({ schema: schema });

function nW() {
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
      preload: path.join(__dirname, "app", "src", "scripts", "preload.js"),
    },
    show: false,
  });

  mW.setAutoTheme();
  mW.setMicaEffect();

  const connectWheel = (d) => {
    setTimeout(() => {
      wheel.connect(d, (err) => {
        try {
          err;
        } catch {
          console.error(err);
        } finally {
          wheel.on("data", (data) => {
            const turn = data[4];
            mW.webContents.send("wheelTurn", (turn / 255) * 100);
          });
        }
      });
    }, 1000);
  };

  ipcMain.handle("is-maximized", async () => mW.isMaximized());
  ipcMain.handle("minimizeWindow", () => mW.minimize());
  ipcMain.handle("maximizeWindow", () => mW.maximize());
  ipcMain.handle("restoreWindow", () => mW.unmaximize());
  ipcMain.handle("closeWindow", () => {
    wheel.disconnect();
    mW.close();
  });

  ipcMain.on("updateWheelCfg", (e, d) => {
    store.set("wheelRange", parseInt(d));
    wheel.disconnect();
    /* wheel.connect({ autocenter: false, range: d }, function (err) {}); */
    const wheelOptions = {
      autocenter: false,
      range: d,
    };
    connectWheel(wheelOptions);
  });
  ipcMain.handle("getWheelRange", () => {
    return store.get("wheelRange");
  });

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

  /* mW.loadFile('app/index.html') */
  mW.loadURL("http://127.0.0.1:3000/app");

  // mW.webContents.openDevTools()

  ipcMain.handle("connectWheel", (d) => {
    const wheelOptions = {
      autocenter: false,
      debug: true,
      range: store.get("wheelRange"),
    };
    connectWheel(wheelOptions);
  });

  mW.addListener('close', ()=> wheel.disconnect())

  mW.show();
}

app.whenReady().then(() => {
  nW();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) nW();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
