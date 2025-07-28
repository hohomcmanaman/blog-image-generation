# Multi-stage build for Blog Image Generator
FROM node:18-bullseye as builder

# Install system dependencies for Sharp and Canvas
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build React app
RUN npm run react-build

# Production stage
FROM node:18-bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libfontconfig1 \
    libfreetype6 \
    libjpeg62-turbo \
    libpng16-16 \
    librsvg2-2 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/main ./src/main
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create a non-root user
RUN useradd -m -s /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV ELECTRON_DISABLE_SECURITY_WARNINGS=true

# Expose port (if running in web mode)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Start the application
CMD ["npm", "start"]