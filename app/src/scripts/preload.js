// 
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isMaximized: () => ipcRenderer.invoke("is-maximized"),
  getAccent: () => ipcRenderer.invoke("get-accent"),
});

contextBridge.exposeInMainWorld("wheelInterface", {
  updateCfg: (data) => ipcRenderer.send("updateWheelCfg", data),
});

const loadControlListeners = () => {
  const menu = document.querySelector("#menu");
  const isMaximized = async () => {
    return await ipcRenderer.invoke("is-maximized");
  };
  document
    .querySelector(".credits .link.github")
    .addEventListener("click", () => {
      ipcRenderer.invoke("open-link", "github");
    });
  document
    .querySelector(".credits .link.feedback")
    .addEventListener("click", () => {
      ipcRenderer.invoke("open-link", "feedback");
    });
  document
    .querySelector(".credits .link.help")
    .addEventListener("click", () => {
      ipcRenderer.invoke("open-link", "help");
    });
  document.querySelector("#winCon.clo").addEventListener("click", () => {
    ipcRenderer.invoke("closeWindow");
  });
  document.querySelector("#winCon.min").addEventListener("click", () => {
    ipcRenderer.invoke("minimizeWindow");
  });
  document.querySelector("#winCon.max").addEventListener("click", () => {
    ipcRenderer.invoke("maximizeWindow");
    let max = document.querySelector("#winCon.max");
    let res = document.querySelector("#winCon.res");
    if (isMaximized()) {
      max.style.display = "none";
      res.style.display = "grid";
    } else {
      max.style.display = "grid";
      res.style.display = "none";
    }
  });
  document.querySelector("#winCon.res").addEventListener("click", () => {
    ipcRenderer.invoke("restoreWindow");
    let max = document.querySelector("#winCon.max");
    let res = document.querySelector("#winCon.res");
    if (isMaximized()) {
      max.style.display = "grid";
      res.style.display = "none";
    } else {
      max.style.display = "none";
      res.style.display = "grid";
    }
  });
};

const determineWheelRotation = (wheelRange, turnAmount) => {
  return (turnAmount / 100) * wheelRange - wheelRange * 0.5; // "transform: rotate()" accepts overflowing degrees so we don't need to clamp
};

const updateWheelDisplay = async (wheelPreview, turnAmount) => {
  await ipcRenderer.invoke("getWheelRange").then((value) => {
    const wheelRotation = determineWheelRotation(value, turnAmount);
    wheelPreview.style.transform = `rotate(${wheelRotation}deg)`;
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  await ipcRenderer.invoke("get-accent").then((value) => {
    console.log(value);
    document.querySelector("#autoTheme").innerHTML = `
  @media (prefers-color-scheme: dark) {
    :root {
      --layerFillColorPrimary: rgb(58 58 58 / 30%);
      --subtleFillColorSecondary: rgb(255 255 255 / 6%);
      --controlFillColorPrimary: rgb(255 255 255 / 6%);
      --textFillColorPrimary: #fff;
      --layerStroke: rgb(0 0 0 / 10%);
      --dividerStroke: rgb(255 255 255 / 8.37%);
      --navIndicator: ${value.accentLight2.hex};
      --accentedText: ${value.accentLight3.hex};
      --accentedTextHover: ${value.accentLight2.hex};
      --buttonBorder: radial-gradient(circle at 100% 100%, transparent 3px, rgb(255 255 255 / 6%) 3px, rgb(255 255 255 / 6%) 4px, transparent 4px), 
      linear-gradient(to right, rgb(255 255 255 / 9.83%), rgb(255 255 255 / 9.83%)), 
      radial-gradient(circle at 0% 100%, transparent 3px, rgb(255 255 255 / 9.83%) 3px, rgb(255 255 255 / 9.83%) 4px, transparent 4px), 
      linear-gradient(to bottom, rgb(255 255 255 / 9.83%), rgb(255 255 255 / 6.05%)), 
      radial-gradient(circle at 0% 0%, transparent 3px, rgb(255 255 255 / 6.05%) 3px, rgb(255 255 255 / 6.05%) 4px, transparent 4px), 
      linear-gradient(to left, rgb(255 255 255 / 6.05%), rgb(255 255 255 / 6.05%)), 
      radial-gradient(circle at 100% 0%, transparent 3px, rgb(255 255 255 / 6.05%) 3px, rgb(255 255 255 / 6.05%) 4px, transparent 4px), 
      linear-gradient(to top, rgb(255 255 255 / 6.05%), rgb(255 255 255 / 9.83%));
    }
  }
  
  @media (prefers-color-scheme: light) {
    :root {
      --layerFillColorPrimary: rgb(255 255 255 / 50%);
      --subtleFillColorSecondary: rgb(0 0 0 / 4%);
      --controlFillColorPrimary: rgb(255 255 255 / 70%);
      --textFillColorPrimary: rgb(0 0 0 / 90%);
      --layerStroke: rgb(0 0 0 / 6%);
      --dividerStroke: rgb(255 255 255 / 8.37%);
      --navIndicator: ${value.accentDark1.hex};
      --accentedText: ${value.accentDark2.hex};
      --accentedTextHover: ${value.accentDark3.hex};
      --buttonBorder: radial-gradient(circle at 100% 100%, transparent 3px, rgb(0 0 0 / 16.22%) 3px, rgb(0 0 0 / 16.22%) 4px, transparent 4px), 
      linear-gradient(to right, rgb(0 0 0 / 5.78%), rgb(0 0 0 / 5.78%)), 
      radial-gradient(circle at 0% 100%, transparent 3px, rgb(0 0 0 / 5.78%) 3px, rgb(0 0 0 / 5.78%) 4px, transparent 4px), 
      linear-gradient(to bottom, rgb(0 0 0 / 5.78%), rgb(0 0 0 / 16.22%)), 
      radial-gradient(circle at 0% 0%, transparent 3px, rgb(0 0 0 / 16.22%) 3px, rgb(0 0 0 / 16.22%) 4px, transparent 4px), 
      linear-gradient(to left, rgb(0 0 0 / 16.22%), rgb(0 0 0 / 16.22%)), 
      radial-gradient(circle at 100% 0%, transparent 3px, rgb(0 0 0 / 16.22%) 3px, rgb(0 0 0 / 16.22%) 4px, transparent 4px), 
      linear-gradient(to top, rgb(0 0 0 / 16.22%), rgb(0 0 0 / 5.78%));
    }
  }
  `;
  });

  loadControlListeners();

  const navExpand = () => {
    const sidenav = document.querySelector(".sidenav");
    const buttonBody = document.querySelectorAll(".buttonBody");
    if (!!!sidenav.classList.contains("open")) {
      sidenav.classList.add("open");
      buttonBody.forEach((el) => {
        el.classList.add("open");
      });
    } else {
      sidenav.classList.remove("open");
      buttonBody.forEach((el) => {
        el.classList.toggle("open");
      });
    }
  };

  menu.addEventListener("click", () => navExpand());

  const wheelPreview = document.querySelector(".wheelArt");
  let settingsForm = document.querySelector("#wheelCfgForm");
  let settingsFormSubmit = document.querySelector(".formSubmitButton");

  /* await ipcRenderer.invoke("connectWheel"); */

  await ipcRenderer.invoke("getWheelRange").then((value) => {
    document.querySelector("#wheelRangeSlider").value = value;
    document.querySelector("#wheelRangeValue").innerHTML = `${value}°`;
  });

  settingsForm.addEventListener("submit", (event) => {
    settingsFormSubmit.innerText = "";
    console.log(settingsFormSubmit.children[0]);
    settingsFormSubmit.children[0].style.display = "block";
  });

  ipcRenderer.on("wheelTurn", (event, amount) => {
    updateWheelDisplay(wheelPreview, amount);
  });
});

window.onbeforeunload = (event) => {
  /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
  /* win.removeAllListeners(); */
};

/* window.onclose(()=>{
  ipcRenderer.invoke('disconnectWheel')
}) */
