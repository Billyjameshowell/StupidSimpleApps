import fs from 'fs';
import path from 'path';

// Function to convert bytes to KB
function bytesToKB(bytes) {
  return Math.round(bytes / 1024);
}

// Main bundle analysis function
async function analyzeBundles() {
  try {
    const publicDir = path.resolve('dist/public');
    const assetsDir = path.resolve(publicDir, 'assets');
    
    // Check if directories exist
    if (!fs.existsSync(assetsDir)) {
      throw new Error('Assets directory not found. Make sure the build was successful.');
    }
    
    // Get all files in the assets directory
    const files = fs.readdirSync(assetsDir);
    
    // Filter JS and CSS files
    const jsFiles = files.filter(file => file.endsWith('.js'));
    const cssFiles = files.filter(file => file.endsWith('.css'));
    
    // Analyze JS files
    const jsChunks = jsFiles.map(file => {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: bytesToKB(stats.size)
      };
    });
    
    // Analyze CSS files
    const cssChunks = cssFiles.map(file => {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: bytesToKB(stats.size)
      };
    });
    
    // Calculate total sizes
    const totalJSSize = jsChunks.reduce((acc, chunk) => acc + chunk.size, 0);
    const totalCSSSize = cssChunks.reduce((acc, chunk) => acc + chunk.size, 0);
    const totalSize = totalJSSize + totalCSSSize;
    
    // Identify large chunks (>250KB)
    const largeChunks = [...jsChunks, ...cssChunks].filter(chunk => chunk.sizeKB > 250);
    
    // Create the analysis report
    const analysisReport = {
      totalSize: totalSize,
      totalSizeKB: bytesToKB(totalSize),
      js: {
        totalSize: totalJSSize,
        totalSizeKB: bytesToKB(totalJSSize),
        chunks: jsChunks
      },
      css: {
        totalSize: totalCSSSize,
        totalSizeKB: bytesToKB(totalCSSSize),
        chunks: cssChunks
      },
      largeChunks: largeChunks,
      timestamp: new Date().toISOString()
    };
    
    // Write the analysis to a JSON file
    fs.writeFileSync('bundle-analysis.json', JSON.stringify(analysisReport, null, 2));
    
    console.log('Bundle analysis complete. Results saved to bundle-analysis.json');
    console.log(`Total bundle size: ${analysisReport.totalSizeKB} KB`);
    
    if (largeChunks.length > 0) {
      console.log('\nLarge chunks (>250KB):');
      largeChunks.forEach(chunk => {
        console.log(`- ${chunk.name}: ${chunk.sizeKB} KB`);
      });
    } else {
      console.log('\nNo large chunks (>250KB) found.');
    }
    
    return analysisReport;
  } catch (error) {
    console.error('Error analyzing bundles:', error.message);
    
    // Create an error report
    const errorReport = {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    };
    
    // Write the error report to the JSON file
    fs.writeFileSync('bundle-analysis.json', JSON.stringify(errorReport, null, 2));
    
    console.log('Error report saved to bundle-analysis.json');
    return errorReport;
  }
}

// Run the analysis
analyzeBundles();

