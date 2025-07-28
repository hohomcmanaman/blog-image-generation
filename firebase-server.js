// Firebase App Hosting optimized server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { searchImages, downloadImage, processImage } = require('./src/main/imageService');
const { uploadToCloud, saveCloudConfig, loadCloudConfig } = require('./src/main/cloudStorage');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint for Firebase
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'blog-image-generator',
    version: '1.0.0'
  });
});

// API Routes with enhanced error handling
app.post('/api/search-images', async (req, res) => {
  try {
    console.log('Search request:', req.body);
    const { query, filters } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required and must be a string' 
      });
    }
    
    const result = await searchImages(query, filters);
    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during image search',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/download-image', async (req, res) => {
  try {
    console.log('Download request:', req.body);
    const { imageUrl, filename } = req.body;
    
    if (!imageUrl || !filename) {
      return res.status(400).json({ 
        success: false, 
        error: 'imageUrl and filename are required' 
      });
    }
    
    const result = await downloadImage(imageUrl, filename);
    res.json(result);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during image download',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/process-image', async (req, res) => {
  try {
    console.log('Process request:', req.body);
    const { imagePath, options } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ 
        success: false, 
        error: 'imagePath is required' 
      });
    }
    
    const result = await processImage(imagePath, options);
    
    if (result.success && result.buffer) {
      // Convert buffer to base64 for web transmission
      const base64 = Buffer.from(result.buffer.data || result.buffer).toString('base64');
      res.json({
        success: true,
        image: `data:image/${options?.format || 'jpeg'};base64,${base64}`
      });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during image processing',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/upload-to-cloud', async (req, res) => {
  try {
    const { provider, filePath, fileName, config } = req.body;
    const result = await uploadToCloud(provider, filePath, fileName, config);
    res.json(result);
  } catch (error) {
    console.error('Cloud upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during cloud upload',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1d',
  etag: false
}));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Blog Image Generator running on http://${HOST}:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔑 Pexels API configured: ${process.env.PEXELS_API_KEY ? 'Yes' : 'No'}`);
  console.log('📋 Features available:');
  console.log('- Search Pexels images ✅');
  console.log('- Auto-resize & crop ✅');
  console.log('- Text overlays ✅');
  console.log('- Watermarks ✅');
  console.log('- Multiple formats (JPEG, PNG, WebP) ✅');
  console.log('- Cloud storage (Dropbox) ✅');
});

module.exports = app;