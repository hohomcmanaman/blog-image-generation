# 🔥 Firebase App Hosting Deployment Guide

Deploy your Blog Image Generator to Firebase App Hosting with GitHub integration.

## 🚀 **Quick Setup Steps**

### **1. Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `blog-image-generator` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### **2. Enable Firebase App Hosting**

1. In Firebase Console, go to **App Hosting** (in left sidebar)
2. Click "Get started"
3. Choose "Connect GitHub repository"
4. Connect your GitHub account
5. Select repository: `hohomcmanaman/blog-image-generation`
6. Choose branch: `main`

### **3. Configure Environment Variables**

In Firebase Console → App Hosting → Settings:

**Required Environment Variables:**
```
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
```

**Required Secrets:**
```
PEXELS_API_KEY=your_pexels_api_key_here
```

### **4. Set Up GitHub Secrets**

In your GitHub repository settings → Secrets and variables → Actions:

Add these secrets:
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_TOKEN`: Firebase deploy token (get with `firebase login:ci`)
- `PEXELS_API_KEY`: Your Pexels API key

### **5. Deploy**

Push to main branch or manually trigger deployment:

```bash
git add .
git commit -m "Configure Firebase App Hosting deployment"
git push origin main
```

## 🔧 **Manual Deployment (Alternative)**

### **Prerequisites**
```bash
npm install -g firebase-tools
firebase login
```

### **Initialize Firebase**
```bash
firebase init apphosting
# Select your Firebase project
# Choose GitHub repository: hohomcmanaman/blog-image-generation
# Select branch: main
```

### **Deploy**
```bash
# Build the app
npm run build-for-firebase

# Deploy to Firebase
firebase apphosting:backends:deploy
```

## 🌐 **Access Your Deployed App**

After successful deployment:
- **Firebase URL**: `https://your-project-id.web.app`
- **Custom Domain**: Configure in Firebase Console → Hosting

## 📊 **Features Available on Firebase**

✅ **Auto-scaling** - Handles traffic spikes automatically
✅ **Global CDN** - Fast worldwide access
✅ **HTTPS** - Automatic SSL certificates
✅ **GitHub Integration** - Auto-deploy on push
✅ **Environment Variables** - Secure secret management
✅ **Monitoring** - Built-in analytics and logging
✅ **Zero Downtime** - Rolling deployments

## 🔍 **Monitoring & Debugging**

### **View Logs**
```bash
firebase apphosting:backends:logs --project=your-project-id
```

### **Monitor Performance**
- Firebase Console → App Hosting → Metrics
- Real-time traffic, errors, and performance data

### **Debug Issues**
- Check GitHub Actions for build failures
- Verify environment variables in Firebase Console
- Monitor Firebase logs for runtime errors

## 🛠️ **Configuration Files Explained**

### **`apphosting.yaml`**
- Runtime configuration (Node.js 18)
- Environment variables and secrets
- Build commands and health checks

### **`firebase.json`**
- Firebase services configuration
- Hosting rules and rewrites
- CORS headers for API endpoints

### **`firebase-server.js`**
- Production-optimized Express server
- Enhanced error handling and logging
- Health check endpoints for Firebase

### **`.github/workflows/firebase-deploy.yml`**
- Automated deployment pipeline
- Builds and tests on every push
- Deploys to Firebase App Hosting

## 🔒 **Security Best Practices**

✅ **No hardcoded secrets** - All sensitive data in Firebase secrets
✅ **CORS configured** - Proper cross-origin resource sharing
✅ **Environment separation** - Different configs for dev/prod
✅ **Error handling** - Sanitized error messages in production
✅ **Input validation** - Server-side request validation

## 🚨 **Troubleshooting**

### **Common Issues**

**Build Fails:**
- Check system dependencies in GitHub Actions
- Verify Node.js version compatibility
- Review build logs in Actions tab

**API Not Working:**
- Verify `PEXELS_API_KEY` secret is set correctly
- Check Firebase App Hosting logs
- Ensure API endpoints are properly routed

**Deployment Fails:**
- Verify Firebase token is valid
- Check Firebase project permissions
- Review GitHub Actions logs

### **Getting Help**

- **Firebase Documentation**: [firebase.google.com/docs/app-hosting](https://firebase.google.com/docs/app-hosting)
- **GitHub Issues**: Report bugs in your repository
- **Firebase Support**: Firebase Console → Support

## 🎉 **Success!**

Your Blog Image Generator is now:
- 🌍 **Globally accessible** via Firebase CDN
- 🔄 **Auto-deploying** from GitHub
- 📈 **Scalable** for any traffic volume
- 🔒 **Secure** with proper authentication
- 📊 **Monitored** with Firebase analytics

**Live URL**: `https://your-project-id.web.app`