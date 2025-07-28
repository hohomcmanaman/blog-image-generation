// Simple electron-is-dev replacement
module.exports = process.env.NODE_ENV === 'development' || 
                 process.env.ELECTRON_IS_DEV === 'true' ||
                 process.defaultApp ||
                 /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
                 /[\\/]electron[\\/]/.test(process.execPath);