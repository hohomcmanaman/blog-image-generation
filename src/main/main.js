const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('./electron-is-dev');
const { searchImages, downloadImage, processImage } = require('./imageService');
const { uploadToCloud, saveCloudConfig, loadCloudConfig } = require('./cloudStorage');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../public/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('search-images', async (event, query, filters) => {
  try {
    return await searchImages(query, filters);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('download-image', async (event, imageUrl, filename) => {
  try {
    return await downloadImage(imageUrl, filename);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('process-image', async (event, imagePath, options) => {
  try {
    return await processImage(imagePath, options);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('save-dialog', async (event, options) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('open-dialog', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('upload-to-cloud', async (event, provider, filePath, fileName, config) => {
  try {
    return await uploadToCloud(provider, filePath, fileName, config);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('save-cloud-config', async (event, provider, config) => {
  try {
    return await saveCloudConfig(provider, config);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('load-cloud-config', async (event, provider) => {
  try {
    return await loadCloudConfig(provider);
  } catch (error) {
    throw error;
  }
});