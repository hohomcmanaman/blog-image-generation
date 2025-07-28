#!/bin/bash

# Blog Image Generator Stop Script

APP_DIR="/home/h1o2s6/Projects/blog-image-generator"
LOG_FILE="$APP_DIR/logs/startup.log"

echo "$(date): Stopping Blog Image Generator..." >> "$LOG_FILE"

# Kill the web server process
pkill -f "web-server.js"

# Kill PM2 process if running
pm2 stop blog-image-generator 2>/dev/null

echo "$(date): App stopped" >> "$LOG_FILE"
echo "Blog Image Generator stopped"