import fs from 'fs';
import path from 'path';
import https from 'https';
import url from 'url';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get file size in KB
function getFileSizeInKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024);
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error.message);
    return 0;
  }
}

// Function to check if an image has lazy loading
function hasLazyLoading(filePath) {
  if (filePath.startsWith('http')) {
    return false; // Can't check remote files for lazy loading
  }
  
  try {
    // For local files, we can check if they're referenced in code with lazy loading
    const fileExtension = path.extname(filePath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(fileExtension)) {
      const fileName = path.basename(filePath);
      // Search for references to this file with lazy loading
      const command = `grep -r "loading=\\"lazy\\"" --include="*.tsx" --include="*.jsx" --include="*.html" ./client/src`;
      const result = execSync(command, { encoding: 'utf8' });
      return result.includes(fileName);
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Function to check if an image could be optimized
function needsOptimization(filePath, sizeInKB) {
  if (sizeInKB < 100) {
    return false; // Already small enough
  }
  
  const fileExtension = path.extname(filePath).toLowerCase();
  
  // Check if the image could benefit from a more efficient format
  if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
    return true; // Could potentially be converted to WebP
  }
  
  return false;
}

// Function to estimate potential size savings
function estimateSizeSavings(filePath, sizeInKB) {
  const fileExtension = path.extname(filePath).toLowerCase();
  
  // Rough estimates based on typical compression ratios
  if (['.jpg', '.jpeg'].includes(fileExtension)) {
    return Math.round(sizeInKB * 0.3); // ~30% savings with WebP
  } else if (fileExtension === '.png') {
    return Math.round(sizeInKB * 0.5); // ~50% savings with WebP
  } else if (fileExtension === '.gif') {
    return Math.round(sizeInKB * 0.4); // ~40% savings with WebP
  }
  
  return 0;
}

// Function to download and analyze a remote image
function analyzeRemoteImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(imageUrl);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'HEAD',
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        resolve({
          url: imageUrl,
          sizeInKB: 0,
          exists: false,
          error: `HTTP status ${res.statusCode}`
        });
        return;
      }

      const contentLength = res.headers['content-length'];
      const contentType = res.headers['content-type'];
      
      if (!contentLength || !contentType || !contentType.startsWith('image/')) {
        resolve({
          url: imageUrl,
          sizeInKB: 0,
          exists: false,
          error: 'Not an image or size unknown'
        });
        return;
      }

      const sizeInKB = Math.round(parseInt(contentLength, 10) / 1024);
      const fileExtension = path.extname(parsedUrl.pathname).toLowerCase();
      
      resolve({
        url: imageUrl,
        sizeInKB,
        exists: true,
        hasLazyLoading: false, // Can't determine for remote images
        needsOptimization: needsOptimization(fileExtension, sizeInKB),
        potentialSavingsKB: estimateSizeSavings(fileExtension, sizeInKB)
      });
    });

    req.on('error', (error) => {
      resolve({
        url: imageUrl,
        sizeInKB: 0,
        exists: false,
        error: error.message
      });
    });

    req.end();
  });
}

// Main function to scan for images
async function scanImages() {
  const imageAudit = {
    totalImageCount: 0,
    totalSizeInMB: 0,
    largeImages: [],
    missingOptimizations: [],
    potentialSavingsInMB: 0,
    inaccessibleDirectories: [],
    remoteImages: []
  };

  // Find all local image files
  try {
    const command = `find . -type f -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" | grep -v "node_modules"`;
    const result = execSync(command, { encoding: 'utf8' });
    const localImagePaths = result.trim().split('\n').filter(Boolean);
    
    // Process local images
    for (const imagePath of localImagePaths) {
      const sizeInKB = getFileSizeInKB(imagePath);
      imageAudit.totalImageCount++;
      imageAudit.totalSizeInMB += sizeInKB / 1024;
      
      const hasLazy = hasLazyLoading(imagePath);
      const needsOptimize = needsOptimization(imagePath, sizeInKB);
      const potentialSavings = estimateSizeSavings(imagePath, sizeInKB);
      
      if (sizeInKB > 100) {
        imageAudit.largeImages.push({
          path: imagePath,
          sizeInKB,
          hasLazyLoading: hasLazy
        });
      }
      
      if (needsOptimize) {
        imageAudit.missingOptimizations.push({
          path: imagePath,
          sizeInKB,
          hasLazyLoading: hasLazy,
          potentialSavingsKB: potentialSavings
        });
        
        imageAudit.potentialSavingsInMB += potentialSavings / 1024;
      }
    }
  } catch (error) {
    console.error('Error scanning local images:', error.message);
    imageAudit.inaccessibleDirectories.push('Error scanning local images: ' + error.message);
  }

  // Find remote images in code
  try {
    const command = `grep -r "src=\\"http" --include="*.tsx" --include="*.jsx" --include="*.html" ./client/src`;
    const result = execSync(command, { encoding: 'utf8' });
    
    // Extract URLs from the grep results
    const urlRegex = /src="(https?:\/\/[^"]+)"/g;
    const remoteUrls = [];
    let match;
    
    while ((match = urlRegex.exec(result)) !== null) {
      remoteUrls.push(match[1]);
    }
    
    // Analyze remote images
    for (const imageUrl of remoteUrls) {
      try {
        const analysis = await analyzeRemoteImage(imageUrl);
        
        if (analysis.exists) {
          imageAudit.totalImageCount++;
          imageAudit.totalSizeInMB += analysis.sizeInKB / 1024;
          
          if (analysis.sizeInKB > 100) {
            imageAudit.largeImages.push({
              path: imageUrl,
              sizeInKB: analysis.sizeInKB,
              hasLazyLoading: false,
              isRemote: true
            });
          }
          
          if (analysis.needsOptimization) {
            imageAudit.missingOptimizations.push({
              path: imageUrl,
              sizeInKB: analysis.sizeInKB,
              hasLazyLoading: false,
              potentialSavingsKB: analysis.potentialSavingsKB,
              isRemote: true
            });
            
            imageAudit.potentialSavingsInMB += analysis.potentialSavingsKB / 1024;
          }
          
          imageAudit.remoteImages.push(analysis);
        } else {
          console.error(`Could not access remote image: ${imageUrl}`, analysis.error);
          imageAudit.remoteImages.push({
            url: imageUrl,
            error: analysis.error
          });
        }
      } catch (error) {
        console.error(`Error analyzing remote image ${imageUrl}:`, error.message);
        imageAudit.remoteImages.push({
          url: imageUrl,
          error: error.message
        });
      }
    }
  } catch (error) {
    if (!error.message.includes('No such file or directory')) {
      console.error('Error scanning remote images:', error.message);
      imageAudit.inaccessibleDirectories.push('Error scanning remote images: ' + error.message);
    }
  }

  // Round the total size and potential savings to 2 decimal places
  imageAudit.totalSizeInMB = parseFloat(imageAudit.totalSizeInMB.toFixed(2));
  imageAudit.potentialSavingsInMB = parseFloat(imageAudit.potentialSavingsInMB.toFixed(2));

  // Write the audit report to a JSON file
  fs.writeFileSync('image-audit.json', JSON.stringify(imageAudit, null, 2));
  console.log('Image audit completed. Results saved to image-audit.json');
}

// Run the scan
scanImages().catch(error => {
  console.error('Error during image scan:', error);
  process.exit(1);
});

