import React, { useState, useEffect, useRef } from 'react';
import './ImageEditor.css';

function ImageEditor({ image, onBack }) {
  const [processedImage, setProcessedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloadedPath, setDownloadedPath] = useState(null);
  const canvasRef = useRef(null);
  
  const [settings, setSettings] = useState({
    width: 1200,
    height: 630,
    format: 'jpeg',
    quality: 90,
    crop: 'smart',
    title: '',
    subtitle: '',
    titleFont: '48px Arial',
    subtitleFont: '32px Arial',
    titleColor: '#ffffff',
    subtitleColor: '#ffffff',
    textPosition: 'center',
    textBackground: 'rgba(0, 0, 0, 0.5)',
    watermarkText: '',
    watermarkPosition: 'bottom-right'
  });

  useEffect(() => {
    if (image) {
      downloadImage();
    }
  }, [image]);

  const downloadImage = async () => {
    try {
      setProcessing(true);
      const filename = `pexels-${image.id}.jpg`;
      
      if (window.electronAPI) {
        const result = await window.electronAPI.downloadImage(image.src.large, filename);
        
        if (result.success) {
          setDownloadedPath(result.filepath);
          await processImage(result.filepath);
        } else {
          alert('Error downloading image: ' + result.error);
        }
      } else {
        // Web environment - use fetch API
        const response = await fetch('/api/download-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: image.src.large, filename })
        });
        const result = await response.json();
        
        if (result.success) {
          setDownloadedPath(result.filepath);
          await processImage(result.filepath);
        } else {
          alert('Error downloading image: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading image: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const processImage = async (imagePath = downloadedPath) => {
    if (!imagePath) return;
    
    try {
      setProcessing(true);
      
      const options = {
        width: parseInt(settings.width),
        height: parseInt(settings.height),
        format: settings.format,
        quality: parseInt(settings.quality),
        crop: settings.crop,
        textOverlay: (settings.title || settings.subtitle) ? {
          title: settings.title,
          subtitle: settings.subtitle,
          titleFont: settings.titleFont,
          subtitleFont: settings.subtitleFont,
          titleColor: settings.titleColor,
          subtitleColor: settings.subtitleColor,
          position: settings.textPosition,
          backgroundColor: settings.textBackground
        } : null,
        watermark: settings.watermarkText ? {
          text: settings.watermarkText,
          position: settings.watermarkPosition
        } : null
      };

      if (window.electronAPI) {
        const result = await window.electronAPI.processImage(imagePath, options);
        
        if (result.success) {
          const blob = new Blob([new Uint8Array(result.buffer.data)], { 
            type: `image/${settings.format}` 
          });
          const url = URL.createObjectURL(blob);
          setProcessedImage(url);
        } else {
          alert('Error processing image: ' + result.error);
        }
      } else {
        // Web environment - use fetch API
        const response = await fetch('/api/process-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePath, options })
        });
        const result = await response.json();
        
        if (result.success) {
          setProcessedImage(result.image); // Base64 image data
        } else {
          alert('Error processing image: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Processing error:', error);
      alert('Error processing image: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!downloadedPath) return;
    
    try {
      const result = await window.electronAPI.saveDialog({
        defaultPath: `blog-image-${Date.now()}.${settings.format}`,
        filters: [
          { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }
        ]
      });

      if (!result.canceled) {
        const processResult = await window.electronAPI.processImage(downloadedPath, {
          ...settings,
          width: parseInt(settings.width),
          height: parseInt(settings.height),
          quality: parseInt(settings.quality),
          outputPath: result.filePath,
          textOverlay: (settings.title || settings.subtitle) ? {
            title: settings.title,
            subtitle: settings.subtitle,
            titleFont: settings.titleFont,
            subtitleFont: settings.subtitleFont,
            titleColor: settings.titleColor,
            subtitleColor: settings.subtitleColor,
            position: settings.textPosition,
            backgroundColor: settings.textBackground
          } : null,
          watermark: settings.watermarkText ? {
            text: settings.watermarkText,
            position: settings.watermarkPosition
          } : null
        });

        if (processResult.success) {
          alert('Image saved successfully!');
        } else {
          alert('Error saving image: ' + processResult.error);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving image: ' + error.message);
    }
  };

  if (!image) {
    return null;
  }

  return (
    <div className="image-editor">
      <div className="editor-layout">
        <div className="editor-sidebar">
          <div className="card">
            <h3 className="mb-4">Image Settings</h3>
            
            <div className="form-group">
              <label>Dimensions</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="input"
                  placeholder="Width"
                  value={settings.width}
                  onChange={(e) => handleSettingChange('width', e.target.value)}
                />
                <span className="flex items-center">×</span>
                <input
                  type="number"
                  className="input"
                  placeholder="Height"
                  value={settings.height}
                  onChange={(e) => handleSettingChange('height', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Format</label>
              <select
                className="select w-full"
                value={settings.format}
                onChange={(e) => handleSettingChange('format', e.target.value)}
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quality ({settings.quality}%)</label>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.quality}
                onChange={(e) => handleSettingChange('quality', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="form-group">
              <label>Crop Position</label>
              <select
                className="select w-full"
                value={settings.crop}
                onChange={(e) => handleSettingChange('crop', e.target.value)}
              >
                <option value="smart">Smart Crop</option>
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="card mt-4">
            <h3 className="mb-4">Text Overlay</h3>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter title text"
                value={settings.title}
                onChange={(e) => handleSettingChange('title', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter subtitle text"
                value={settings.subtitle}
                onChange={(e) => handleSettingChange('subtitle', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Text Position</label>
              <select
                className="select w-full"
                value={settings.textPosition}
                onChange={(e) => handleSettingChange('textPosition', e.target.value)}
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <div className="grid grid-2 gap-2">
              <div className="form-group">
                <label>Title Color</label>
                <input
                  type="color"
                  className="input w-full"
                  value={settings.titleColor}
                  onChange={(e) => handleSettingChange('titleColor', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Subtitle Color</label>
                <input
                  type="color"
                  className="input w-full"
                  value={settings.subtitleColor}
                  onChange={(e) => handleSettingChange('subtitleColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <h3 className="mb-4">Watermark</h3>
            
            <div className="form-group">
              <label>Watermark Text</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Your brand/website"
                value={settings.watermarkText}
                onChange={(e) => handleSettingChange('watermarkText', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <select
                className="select w-full"
                value={settings.watermarkPosition}
                onChange={(e) => handleSettingChange('watermarkPosition', e.target.value)}
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="btn btn-primary flex-1"
              onClick={() => processImage()}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="loading"></div>
                  Processing...
                </>
              ) : (
                'Update Preview'
              )}
            </button>
            
            <button
              className="btn btn-secondary"
              onClick={handleSave}
              disabled={processing || !processedImage}
            >
              💾 Save
            </button>
          </div>
        </div>

        <div className="editor-preview">
          <div className="preview-container">
            <h3 className="mb-4">Preview</h3>
            
            {processing ? (
              <div className="preview-loading">
                <div className="loading" style={{ width: '40px', height: '40px' }}></div>
                <p>Processing image...</p>
              </div>
            ) : processedImage ? (
              <div className="preview-image-container">
                <img
                  src={processedImage}
                  alt="Processed preview"
                  className="preview-image"
                />
                <div className="preview-info">
                  <p className="text-sm text-muted">
                    {settings.width} × {settings.height} • {settings.format.toUpperCase()} • {settings.quality}% quality
                  </p>
                </div>
              </div>
            ) : (
              <div className="preview-placeholder">
                <img
                  src={image.src.medium}
                  alt={image.alt}
                  className="preview-image"
                />
                <p className="text-sm text-muted mt-2">
                  Original: {image.width} × {image.height}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageEditor;