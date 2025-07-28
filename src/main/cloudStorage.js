const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');

// Cloud storage providers
const cloudProviders = {
  dropbox: null,
  googleDrive: null
};

// Initialize Dropbox
function initializeDropbox(accessToken) {
  try {
    cloudProviders.dropbox = new Dropbox({ accessToken });
    return { success: true };
  } catch (error) {
    console.error('Dropbox initialization error:', error);
    return { success: false, error: error.message };
  }
}

// Upload to Dropbox
async function uploadToDropbox(filePath, fileName) {
  if (!cloudProviders.dropbox) {
    return { success: false, error: 'Dropbox not initialized' };
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const response = await cloudProviders.dropbox.filesUpload({
      path: '/' + fileName,
      contents: fileBuffer,
      mode: 'overwrite',
      autorename: true
    });

    return {
      success: true,
      url: response.result.path_display,
      id: response.result.id
    };
  } catch (error) {
    console.error('Dropbox upload error:', error);
    return { success: false, error: error.message };
  }
}

// Get Dropbox share link
async function getDropboxShareLink(filePath) {
  if (!cloudProviders.dropbox) {
    return { success: false, error: 'Dropbox not initialized' };
  }

  try {
    const response = await cloudProviders.dropbox.sharingCreateSharedLinkWithSettings({
      path: filePath,
      settings: {
        requested_visibility: 'public'
      }
    });

    return {
      success: true,
      shareUrl: response.result.url
    };
  } catch (error) {
    console.error('Dropbox share link error:', error);
    return { success: false, error: error.message };
  }
}

// Upload to cloud storage (generic function)
async function uploadToCloud(provider, filePath, fileName, config = {}) {
  switch (provider) {
    case 'dropbox':
      if (config.accessToken) {
        const initResult = initializeDropbox(config.accessToken);
        if (!initResult.success) {
          return initResult;
        }
      }
      return await uploadToDropbox(filePath, fileName);
    
    case 'googleDrive':
      return { success: false, error: 'Google Drive integration not implemented yet' };
    
    default:
      return { success: false, error: 'Unsupported cloud provider' };
  }
}

// Save configuration
function saveCloudConfig(provider, config) {
  try {
    const configDir = path.join(require('os').homedir(), '.blog-image-generator');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const configPath = path.join(configDir, `${provider}-config.json`);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    return { success: true };
  } catch (error) {
    console.error('Save config error:', error);
    return { success: false, error: error.message };
  }
}

// Load configuration
function loadCloudConfig(provider) {
  try {
    const configDir = path.join(require('os').homedir(), '.blog-image-generator');
    const configPath = path.join(configDir, `${provider}-config.json`);
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return { success: true, config };
    }
    
    return { success: false, error: 'Config file not found' };
  } catch (error) {
    console.error('Load config error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  uploadToCloud,
  saveCloudConfig,
  loadCloudConfig,
  initializeDropbox,
  uploadToDropbox,
  getDropboxShareLink
};