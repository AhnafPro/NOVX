const { ipcRenderer } = require("electron");

window.addEventListener("contextmenu", e => {
  e.preventDefault();

  const el = e.target;
  const params = {
    selectionText: window.getSelection().toString(),
    mediaSrc: el.tagName === "IMG" || el.tagName === "VIDEO" ? el.src : null,
    linkURL: el.closest("a")?.href || null
  };

  ipcRenderer.sendToHost("show-menu", {
    x: e.pageX,
    y: e.pageY,
    params
  });
});

window.addEventListener("click", () => {
  ipcRenderer.sendToHost("hide-menu");
});
