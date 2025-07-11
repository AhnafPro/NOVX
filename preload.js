const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  windowControl: (action) => ipcRenderer.send("win:" + action),
  showContextMenu: (details) => ipcRenderer.send("show-context-menu", details),
  hideContextMenu: () => ipcRenderer.send("hide-context-menu"),
  sendSearch: (query) => ipcRenderer.send("save-search", query)
});

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const el = e.target;
  const params = {
    selectionText: window.getSelection().toString().trim() || null,
    mediaSrc: ["IMG", "VIDEO", "AUDIO"].includes(el.tagName) ? el.src : null,
    linkURL: el.closest("a")?.href || null
  };

  ipcRenderer.sendToHost("show-menu", {
    x: e.clientX,
    y: e.clientY,
    params
  });
});

window.addEventListener("click", () => {
  ipcRenderer.sendToHost("hide-menu");
});
