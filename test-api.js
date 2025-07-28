// Simple test script to verify API and image processing
require('dotenv').config();
const { searchImages, downloadImage, processImage } = require('./src/main/imageService');

async function testApp() {
  console.log('🔍 Testing Pexels API...');
  
  try {
    // Test search
    const searchResult = await searchImages('productivity', { perPage: 3 });
    
    if (searchResult.success) {
      console.log('✅ API Search successful!');
      console.log(`Found ${searchResult.images.length} images`);
      
      if (searchResult.images.length > 0) {
        const testImage = searchResult.images[0];
        console.log(`📸 Test image: ${testImage.width}x${testImage.height} by ${testImage.photographer}`);
        
        // Test download
        console.log('⬇️ Testing image download...');
        const downloadResult = await downloadImage(testImage.src.medium, 'test-image.jpg');
        
        if (downloadResult.success) {
          console.log('✅ Download successful!');
          console.log(`📁 Downloaded to: ${downloadResult.filepath}`);
          
          // Test processing
          console.log('🔧 Testing image processing...');
          const processResult = await processImage(downloadResult.filepath, {
            width: 1200,
            height: 630,
            format: 'jpeg',
            quality: 85,
            textOverlay: {
              title: 'Test Blog Title',
              subtitle: 'This is a test subtitle',
              titleColor: '#ffffff',
              subtitleColor: '#ffffff',
              position: 'center'
            },
            watermark: {
              text: 'MyBlog.com',
              position: 'bottom-right'
            }
          });
          
          if (processResult.success) {
            console.log('✅ Image processing successful!');
            console.log('🎉 All core features working correctly!');
            
            console.log('\n📋 Summary:');
            console.log('- Pexels API: ✅ Working');
            console.log('- Image Download: ✅ Working');
            console.log('- Image Processing: ✅ Working');
            console.log('- Text Overlay: ✅ Working');
            console.log('- Watermark: ✅ Working');
            
          } else {
            console.log('❌ Image processing failed:', processResult.error);
          }
        } else {
          console.log('❌ Download failed:', downloadResult.error);
        }
      }
    } else {
      console.log('❌ API Search failed:', searchResult.error);
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testApp();