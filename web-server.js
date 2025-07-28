// Simple web server for testing the React app
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { searchImages, downloadImage, processImage } = require('./src/main/imageService');
const { uploadToCloud, saveCloudConfig, loadCloudConfig } = require('./src/main/cloudStorage');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// API Routes
app.post('/api/search-images', async (req, res) => {
  try {
    const { query, filters } = req.body;
    const result = await searchImages(query, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/download-image', async (req, res) => {
  try {
    const { imageUrl, filename } = req.body;
    const result = await downloadImage(imageUrl, filename);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/process-image', async (req, res) => {
  try {
    const { imagePath, options } = req.body;
    const result = await processImage(imagePath, options);
    
    if (result.success && result.buffer) {
      // Convert buffer to base64 for web transmission
      const base64 = Buffer.from(result.buffer.data || result.buffer).toString('base64');
      res.json({
        success: true,
        image: `data:image/${options.format || 'jpeg'};base64,${base64}`
      });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/upload-to-cloud', async (req, res) => {
  try {
    const { provider, filePath, fileName, config } = req.body;
    const result = await uploadToCloud(provider, filePath, fileName, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve React app for all routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Blog Image Generator running at http://localhost:${PORT}`);
  console.log('📋 Features available:');
  console.log('- Search Pexels images ✅');
  console.log('- Auto-resize & crop ✅');
  console.log('- Text overlays ✅');
  console.log('- Watermarks ✅');
  console.log('- Multiple formats (JPEG, PNG, WebP) ✅');
  console.log('- Cloud storage (Dropbox) ✅');
});

module.exports = app;