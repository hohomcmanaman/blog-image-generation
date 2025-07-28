# 🎨 Blog Image Generator

> A powerful desktop and web application that automatically generates high-quality, customized images for blog articles using the Pexels.com API.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-28+-purple.svg)](https://electronjs.org/)

![Blog Image Generator Demo](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Blog+Image+Generator+Demo)

## ✨ Features

- **🔍 Smart Image Search** - Keyword-based search with advanced filtering (orientation, color, size)
- **📐 Auto-Resize & Crop** - Intelligent resizing to standard blog dimensions (1200x630px)
- **📝 Text Overlays** - Customizable titles, subtitles with font and color options
- **🏷️ Watermarking** - Add your brand logo or text with flexible positioning
- **💾 Multi-Format Export** - Save in JPEG, PNG, or WebP with quality controls
- **☁️ Cloud Integration** - Direct upload to Dropbox (Google Drive coming soon)
- **🌙 Dark/Light Mode** - Toggle between themes for comfortable usage
- **⚡ Real-time Preview** - See changes instantly before exporting

## Features

- **Keyword-Based Image Search**: Search for relevant images using article keywords with advanced filtering options
- **Auto-Cropping & Resizing**: Intelligent resizing to standard blog dimensions (1200x630px) with smart cropping
- **Text Overlay & Branding**: Add customizable titles, subtitles, and watermarks with font/color options
- **Multiple Export Formats**: Save images in JPEG, PNG, or WebP formats with adjustable quality
- **Cloud Storage Integration**: Upload directly to Dropbox (Google Drive coming soon)
- **Dark/Light Mode**: Toggle between themes for comfortable usage
- **User-Friendly Interface**: Intuitive design with search, preview, and editing tools

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Pexels API key (free at https://www.pexels.com/api/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-image-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Pexels API key**
   
   Create a `.env` file in the root directory:
   ```bash
   echo "PEXELS_API_KEY=your_pexels_api_key_here" > .env
   ```
   
   Alternatively, you can set the environment variable:
   ```bash
   export PEXELS_API_KEY=your_pexels_api_key_here
   ```

## Getting Your Pexels API Key

1. Visit [Pexels API](https://www.pexels.com/api/)
2. Click "Get Started" and create a free account
3. Once logged in, go to your [API dashboard](https://www.pexels.com/api/new/)
4. Generate a new API key
5. Copy the key and add it to your `.env` file

## Usage

### Development Mode

```bash
# Start the React development server and Electron app
npm run dev
```

### Production Build

```bash
# Build the React app and create Electron distribution
npm run build
```

### Package for Distribution

```bash
# Create platform-specific packages
npm run pack
```

## Application Usage

### 1. Search for Images
- Enter keywords related to your blog article (e.g., "productivity tips", "travel guide")
- Use filters to refine results:
  - **Orientation**: Landscape, Portrait, or Square
  - **Color**: Filter by dominant color
  - **Size**: Choose image resolution requirements

### 2. Edit and Customize
- Click on any image to open the editor
- Adjust dimensions (default: 1200x630px for social sharing)
- Add text overlays:
  - **Title**: Main heading text
  - **Subtitle**: Supporting text
  - Customize fonts, colors, and positioning
- Add watermarks:
  - Text-based watermarks
  - Custom positioning options

### 3. Export and Save
- **Local Save**: Save to your computer in JPEG, PNG, or WebP format
- **Cloud Upload**: Upload directly to Dropbox (requires Dropbox access token)
- Adjust quality settings (1-100%)

## Configuration

### Cloud Storage Setup (Dropbox)

1. Create a Dropbox app at [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Generate an access token
3. In the app, go to settings and add your Dropbox access token
4. You can now upload images directly to your Dropbox

### Environment Variables

```bash
PEXELS_API_KEY=your_pexels_api_key
NODE_ENV=development|production
```

## File Structure

```
blog-image-generator/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js          # Main Electron process
│   │   ├── preload.js       # Preload script for IPC
│   │   ├── imageService.js  # Pexels API and image processing
│   │   └── cloudStorage.js  # Cloud storage integrations
│   ├── components/          # React components
│   │   ├── Header.js        # App header with theme toggle
│   │   ├── SearchPanel.js   # Image search interface
│   │   ├── ImageGallery.js  # Image results display
│   │   └── ImageEditor.js   # Image editing interface
│   ├── App.js              # Main React app
│   ├── App.css             # App styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Dependencies

### Core Technologies
- **Electron**: Desktop app framework
- **React**: Frontend framework
- **Axios**: HTTP client for API requests
- **Sharp**: High-performance image processing
- **Canvas**: Text rendering and image manipulation

### Optional Integrations
- **Dropbox SDK**: Cloud storage integration
- **Google Cloud Storage**: Alternative cloud storage (future)

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your Pexels API key is correct
   - Check that the environment variable is set
   - Ensure you haven't exceeded API rate limits

2. **Image Processing Errors**
   - Make sure Sharp is properly installed
   - On some systems, you may need to rebuild Sharp: `npm rebuild sharp`

3. **Electron App Not Starting**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version compatibility

4. **Cloud Upload Issues**
   - Verify your cloud storage access tokens
   - Check internet connectivity
   - Ensure proper permissions for the cloud storage app

### Debug Mode

Run with debug output:
```bash
DEBUG=* npm run dev
```

## Docker Support

### Building Docker Image

```dockerfile
# Dockerfile included in project
docker build -t blog-image-generator .
```

### Running with Docker

```bash
docker run -p 3000:3000 -e PEXELS_API_KEY=your_key blog-image-generator
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

## Roadmap

- [ ] Google Drive integration
- [ ] Batch processing for multiple images
- [ ] Custom font uploads
- [ ] Advanced image filters
- [ ] Template system for consistent branding
- [ ] Plugin system for extensions