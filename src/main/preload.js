const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  searchImages: (query, filters) => ipcRenderer.invoke('search-images', query, filters),
  downloadImage: (imageUrl, filename) => ipcRenderer.invoke('download-image', imageUrl, filename),
  processImage: (imagePath, options) => ipcRenderer.invoke('process-image', imagePath, options),
  saveDialog: (options) => ipcRenderer.invoke('save-dialog', options),
  openDialog: (options) => ipcRenderer.invoke('open-dialog', options),
  uploadToCloud: (provider, filePath, fileName, config) => ipcRenderer.invoke('upload-to-cloud', provider, filePath, fileName, config),
  saveCloudConfig: (provider, config) => ipcRenderer.invoke('save-cloud-config', provider, config),
  loadCloudConfig: (provider) => ipcRenderer.invoke('load-cloud-config', provider),
});