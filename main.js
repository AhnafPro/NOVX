const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow(targetUrl = null) {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      webviewTag: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('chatgpt.html');

  if (targetUrl) {
    win.webContents.once('did-finish-load', () => {
      win.webContents.send('load-url', targetUrl);
    });
  }

  mainWindow = win;
}

app.whenReady().then(() => {
  createWindow();

  app.on('web-contents-created', (_, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      createWindow(url);
      return { action: 'deny' };
    });
  });
});

ipcMain.on('save-search', (_, query) => {
  if (!query.trim()) return;

  const filePath = path.join(app.getPath('userData'), 'search_history.csv');
  const line = `"${new Date().toISOString()}","${query.replace(/"/g, '""')}"\n`;

  fs.appendFile(filePath, line, err => {
    if (err) {
      console.error('Failed to save search history:', err);
    }
  });
});

ipcMain.on('open-external-window', (_, url) => {
  createWindow(url);
});

ipcMain.on('win:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('win:maximize', () => {
  if (mainWindow) {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
  }
});

ipcMain.on('win:close', () => {
  if (mainWindow) mainWindow.close();
});
