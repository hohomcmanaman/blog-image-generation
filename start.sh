#!/bin/bash

# Blog Image Generator Startup Script
# This script ensures the app is always running

APP_DIR="/home/h1o2s6/Projects/blog-image-generator"
APP_NAME="blog-image-generator"
LOG_FILE="$APP_DIR/logs/startup.log"

cd "$APP_DIR"

echo "$(date): Starting Blog Image Generator..." >> "$LOG_FILE"

# Check if the app is already running
if pgrep -f "web-server.js" > /dev/null; then
    echo "$(date): App is already running" >> "$LOG_FILE"
    exit 0
fi

# Build the React app if needed
if [ ! -d "build" ]; then
    echo "$(date): Building React app..." >> "$LOG_FILE"
    npm run react-build >> "$LOG_FILE" 2>&1
fi

# Start the app in background
nohup node web-server.js >> "$LOG_FILE" 2>&1 &

echo "$(date): App started successfully" >> "$LOG_FILE"
echo "Access your app at: http://localhost:3001"
echo "Logs are available at: $LOG_FILE"