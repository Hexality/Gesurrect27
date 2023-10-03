const Body = document.querySelector("body");

const resizeBody = async () => {
  Body.style.width = window.innerWidth - 2 + "px";
  Body.style.height = window.innerHeight - 2 + "px";
};

addEventListener("load", () => resizeBody());
addEventListener("resize", async () => {
  resizeBody();
  const max = document.querySelector("#winCon.max");
  const res = document.querySelector("#winCon.res");
  const isMaximized = await window.electronAPI.isMaximized();
  const colors = await window.electronAPI.getAccent();
  if (isMaximized) {
    max.style.display = "none";
    res.style.display = "grid";
  } else {
    max.style.display = "grid";
    res.style.display = "none";
  }
  console.log(window.innerWidth, " / ", window.screen.availWidth);
  console.log(window.innerHeight, " / ", window.screen.availHeight);
});

const navButtons = document.querySelectorAll(".navButton");
navButtons.forEach((el) => {
  if (!!!el.getAttribute("id").match("menu")) {
    el.addEventListener("click", (ev) => {
      if (!!!el.classList.contains("active")) {
        const page = document.querySelector(`.${el.getAttribute("id")}Options`);
        const indicator = document.querySelector(".activeIndicator");
        document
          .querySelectorAll(".active")
          .forEach((el) => el.classList.remove("active"));
        ev.currentTarget.classList.add("active");
        indicator.style.top = ev.currentTarget.offsetTop + "px";
        page.classList.add("active");
      }
    });
  }
});

const wheelCfgForm = document.getElementById("wheelCfgForm");
wheelCfgForm.addEventListener("submit", (event) => {
  const cfg = event.target;
  window.wheelInterface.updateCfg(cfg.wheelRange.value);
});

const wheelRangeValue = document.getElementById("wheelRangeValue");
document
  .getElementById("wheelRangeSlider")
  .addEventListener("input", (event) => {
    wheelRangeValue.innerHTML = event.target.value + "°";
  });
