# Blog Image Generator - Always Accessible Deployment

## 🚀 **Multiple Deployment Options**

### **Option 1: PM2 Process Manager (Recommended)**

**Start with PM2:**
```bash
# Build and start
npm run react-build
pm2 start ecosystem.config.js

# Set up auto-start on boot
pm2 startup
pm2 save

# Monitor
pm2 list
pm2 logs blog-image-generator
pm2 monit
```

**Manage PM2:**
```bash
pm2 restart blog-image-generator  # Restart app
pm2 stop blog-image-generator     # Stop app
pm2 delete blog-image-generator   # Remove from PM2
```

### **Option 2: Simple Startup Scripts**

**Start the app:**
```bash
./start.sh
```

**Stop the app:**
```bash
./stop.sh
```

**Auto-start on login:**
```bash
# Add to ~/.bashrc or ~/.profile
echo "cd /home/h1o2s6/Projects/blog-image-generator && ./start.sh" >> ~/.bashrc
```

### **Option 3: Systemd Service (Linux)**

**Install service:**
```bash
sudo cp blog-image-generator.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable blog-image-generator
sudo systemctl start blog-image-generator
```

**Manage service:**
```bash
sudo systemctl status blog-image-generator   # Check status
sudo systemctl restart blog-image-generator  # Restart
sudo systemctl stop blog-image-generator     # Stop
sudo systemctl logs -u blog-image-generator  # View logs
```

### **Option 4: Docker Deployment**

**Using Docker Compose:**
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build -d
```

**Using Docker directly:**
```bash
# Build
docker build -t blog-image-generator .

# Run
docker run -d \
  --name blog-image-generator \
  -p 3001:3001 \
  -e PEXELS_API_KEY=your_key_here \
  --restart unless-stopped \
  blog-image-generator
```

### **Option 5: Cloud Deployment**

**Deploy to VPS/Cloud:**
```bash
# Upload files to server
rsync -avz . user@your-server:/path/to/app/

# On server, use any of the above methods
# For production, use PM2 or systemd
```

**Environment Variables for Production:**
```bash
export NODE_ENV=production
export PORT=3001
export PEXELS_API_KEY=your_key_here
```

## 🌐 **Network Access**

### **Local Network Access**
Your app is configured to accept connections from any IP (`0.0.0.0`).

**Access URLs:**
- **Local**: http://localhost:3001
- **Network**: http://YOUR_IP_ADDRESS:3001
- **WSL**: http://172.20.107.170:3001

### **Find Your IP Address**
```bash
# Linux/WSL
ip addr show | grep "inet " | grep -v 127.0.0.1

# Windows (from WSL)
ipconfig.exe | grep "IPv4"
```

### **Firewall Configuration**
```bash
# Ubuntu/Debian
sudo ufw allow 3001

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

## 📊 **Monitoring & Logs**

### **PM2 Monitoring**
```bash
pm2 monit                    # Real-time monitoring
pm2 logs blog-image-generator # View logs
pm2 show blog-image-generator # Detailed info
```

### **Log Files**
- **PM2 logs**: `logs/combined.log`, `logs/out.log`, `logs/error.log`
- **Startup logs**: `logs/startup.log`
- **System logs**: `/var/log/syslog` (for systemd)

### **Health Check**
```bash
# Test if app is running
curl http://localhost:3001

# Check API endpoint
curl -X POST http://localhost:3001/api/search-images \
  -H "Content-Type: application/json" \
  -d '{"query":"test","filters":{"perPage":1}}'
```

## 🔧 **Troubleshooting**

### **Common Issues**
1. **Port already in use**: Change PORT in environment or kill existing process
2. **API key issues**: Verify PEXELS_API_KEY is set correctly
3. **Build errors**: Run `npm run react-build` manually
4. **Permission errors**: Check file permissions and user ownership

### **Quick Fixes**
```bash
# Kill any existing processes
pkill -f "web-server.js"
pkill -f "node.*3001"

# Restart with PM2
pm2 restart blog-image-generator

# Check if port is free
netstat -tulpn | grep :3001
```

## 🎯 **Recommended Setup**

**For Development:**
```bash
npm run dev  # Hot reload
```

**For Production:**
```bash
# Build once
npm run react-build

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

This ensures your Blog Image Generator is always accessible with automatic restarts, monitoring, and logging.