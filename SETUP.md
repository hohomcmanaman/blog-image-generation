# Quick Setup Guide

## Prerequisites Installation

### 1. Install Node.js
- **Windows/macOS**: Download from [nodejs.org](https://nodejs.org/)
- **Linux**: 
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### 2. Verify Installation
```bash
node --version  # Should be v14 or higher
npm --version   # Should be v6 or higher
```

## Project Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd blog-image-generator
npm install
```

### 2. Get Pexels API Key
1. Go to [Pexels API](https://www.pexels.com/api/)
2. Click "Get Started" → Sign up/Login
3. Create new application
4. Copy your API key

### 3. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file and add your API key
echo "PEXELS_API_KEY=your_actual_api_key_here" > .env
```

### 4. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## First Time Usage

1. **Search Test**: Try searching for "nature" to verify API connection
2. **Edit Test**: Select an image and try adding text overlay
3. **Save Test**: Save an image to verify file permissions

## Optional: Cloud Storage Setup

### Dropbox Integration
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Create new app → "Scoped access" → "Full Dropbox" → Name your app
3. Go to Permissions tab → Check "files.content.write" and "files.content.read"
4. Go to Settings tab → Generate access token
5. In the app: Settings → Add Dropbox token

## Troubleshooting Quick Fixes

### API Issues
```bash
# Test API key
curl -H "Authorization: YOUR_API_KEY" "https://api.pexels.com/v1/search?query=test&per_page=1"
```

### Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Sharp/Canvas Issues (Linux)
```bash
sudo apt-get install python3 make g++ libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm rebuild sharp canvas
```

## Docker Quick Start

```bash
# Build image
docker build -t blog-image-generator .

# Run container
docker run -p 3000:3000 -e PEXELS_API_KEY=your_key blog-image-generator
```

## Need Help?

- Check console for error messages
- Verify API key is working at [Pexels API docs](https://www.pexels.com/api/documentation/)
- Make sure all dependencies installed correctly
- Try running in development mode first: `npm run dev`