const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
// Canvas removed for compatibility - using SVG-based text overlay instead
const os = require('os');

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY_HERE';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

async function rateLimitedRequest(url, config) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return axios(url, config);
}

async function searchImages(query, filters = {}) {
  try {
    const params = {
      query,
      per_page: filters.perPage || 20,
      page: filters.page || 1,
    };

    if (filters.orientation) {
      params.orientation = filters.orientation;
    }

    if (filters.size) {
      params.size = filters.size;
    }

    if (filters.color) {
      params.color = filters.color;
    }

    const response = await rateLimitedRequest(`${PEXELS_BASE_URL}/search`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      },
      params
    });

    return {
      success: true,
      data: response.data,
      images: response.data.photos.map(photo => ({
        id: photo.id,
        url: photo.url,
        photographer: photo.photographer,
        src: {
          original: photo.src.original,
          large: photo.src.large,
          medium: photo.src.medium,
          small: photo.src.small
        },
        width: photo.width,
        height: photo.height,
        alt: photo.alt
      }))
    };
  } catch (error) {
    console.error('Error searching images:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
}

async function downloadImage(imageUrl, filename) {
  try {
    const tempDir = path.join(os.tmpdir(), 'blog-image-generator');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const response = await rateLimitedRequest(imageUrl, {
      responseType: 'stream'
    });

    const filepath = path.join(tempDir, filename);
    const writer = fs.createWriteStream(filepath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({ success: true, filepath }));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function processImage(imagePath, options = {}) {
  try {
    const {
      width = 1200,
      height = 630,
      format = 'jpeg',
      quality = 90,
      crop = 'smart',
      textOverlay = null,
      watermark = null,
      outputPath = null
    } = options;

    let image = sharp(imagePath);
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Resize with smart cropping
    if (crop === 'smart') {
      image = image.resize(width, height, {
        fit: 'cover',
        position: 'attention'
      });
    } else {
      image = image.resize(width, height, {
        fit: 'cover',
        position: crop || 'center'
      });
    }

    // Apply format and quality
    if (format === 'jpeg' || format === 'jpg') {
      image = image.jpeg({ quality });
    } else if (format === 'png') {
      image = image.png({ quality });
    } else if (format === 'webp') {
      image = image.webp({ quality });
    }

    // If we need text overlay or watermark, use SVG overlay with Sharp
    if (textOverlay || watermark) {
      const svgOverlay = createSVGOverlay(textOverlay, watermark, width, height);
      image = image.composite([{
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0
      }]);
    }

    // Process and output the final image
    const processedBuffer = await image.toBuffer();
    
    if (outputPath) {
      await image.toFile(outputPath);
      return { success: true, outputPath, buffer: processedBuffer };
    }
    
    return { success: true, buffer: processedBuffer };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function createSVGOverlay(textOverlay, watermark, width, height) {
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Add background overlay if specified
  if (textOverlay && textOverlay.backgroundColor && textOverlay.backgroundColor !== 'transparent') {
    const bgColor = textOverlay.backgroundColor;
    svg += `<rect width="100%" height="100%" fill="${bgColor}"/>`;
  }
  
  // Add text overlay
  if (textOverlay) {
    const {
      title = '',
      subtitle = '',
      titleColor = '#ffffff',
      subtitleColor = '#ffffff',
      position = 'center'
    } = textOverlay;
    
    let yPosition = height / 2;
    if (position === 'top') yPosition = height * 0.3;
    else if (position === 'bottom') yPosition = height * 0.7;
    
    if (title) {
      const titleSize = Math.floor(width / 25); // Responsive font size
      svg += `<text x="${width/2}" y="${yPosition - 30}" 
               font-family="Arial, sans-serif" 
               font-size="${titleSize}" 
               font-weight="bold"
               fill="${titleColor}" 
               text-anchor="middle" 
               stroke="#000000" 
               stroke-width="2">${escapeXml(title)}</text>`;
    }
    
    if (subtitle) {
      const subtitleSize = Math.floor(width / 35); // Smaller than title
      svg += `<text x="${width/2}" y="${yPosition + 40}" 
               font-family="Arial, sans-serif" 
               font-size="${subtitleSize}" 
               fill="${subtitleColor}" 
               text-anchor="middle" 
               stroke="#000000" 
               stroke-width="1">${escapeXml(subtitle)}</text>`;
    }
  }
  
  // Add watermark
  if (watermark && watermark.text) {
    const {
      text = '',
      position = 'bottom-right'
    } = watermark;
    
    const wmSize = Math.floor(width * 0.03);
    let x = width - 20;
    let y = height - 20;
    let anchor = 'end';
    
    if (position.includes('left')) {
      x = 20;
      anchor = 'start';
    }
    if (position.includes('top')) {
      y = 40;
    }
    
    svg += `<text x="${x}" y="${y}" 
             font-family="Arial, sans-serif" 
             font-size="${wmSize}" 
             fill="#ffffff" 
             text-anchor="${anchor}" 
             opacity="0.7">${escapeXml(text)}</text>`;
  }
  
  svg += '</svg>';
  return svg;
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  searchImages,
  downloadImage,
  processImage
};