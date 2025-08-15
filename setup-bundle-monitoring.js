import fs from 'fs';
import path from 'path';

// Function to create a bundle size monitoring setup
function setupBundleMonitoring() {
  try {
    // Create a directory to store historical bundle size data
    const monitoringDir = path.resolve('bundle-monitoring');
    if (!fs.existsSync(monitoringDir)) {
      fs.mkdirSync(monitoringDir);
    }
    
    // Create a script to track bundle sizes over time
    const trackScript = `
import fs from 'fs';
import path from 'path';

// Get the current bundle analysis
const currentAnalysis = JSON.parse(fs.readFileSync('bundle-analysis.json', 'utf8'));

// Create a history entry
const historyEntry = {
  timestamp: new Date().toISOString(),
  totalSizeKB: currentAnalysis.totalSizeKB,
  jsSizeKB: currentAnalysis.js.totalSizeKB,
  cssSizeKB: currentAnalysis.css.totalSizeKB,
  largeChunks: currentAnalysis.largeChunks.map(chunk => ({
    name: chunk.name,
    sizeKB: chunk.sizeKB
  }))
};

// Read the history file or create a new one
const historyPath = path.resolve('bundle-monitoring', 'size-history.json');
let history = [];

if (fs.existsSync(historyPath)) {
  history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

// Add the new entry
history.push(historyEntry);

// Write the updated history
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

console.log('Bundle size history updated.');

// Check for significant changes
const previousEntry = history.length > 1 ? history[history.length - 2] : null;

if (previousEntry) {
  const sizeDiff = historyEntry.totalSizeKB - previousEntry.totalSizeKB;
  const percentChange = (sizeDiff / previousEntry.totalSizeKB) * 100;
  
  console.log(\`Size change: \${sizeDiff > 0 ? '+' : ''}\${sizeDiff} KB (\${percentChange.toFixed(2)}%)\`);
  
  // Alert on significant increases
  if (sizeDiff > 20) {
    console.warn(\`⚠️ WARNING: Bundle size increased by \${sizeDiff} KB (\${percentChange.toFixed(2)}%)!\`);
  }
}
    `;
    
    fs.writeFileSync(path.join(monitoringDir, 'track-bundle-size.js'), trackScript);
    
    // Create a script to generate a bundle size report
    const reportScript = `
import fs from 'fs';
import path from 'path';

// Read the history file
const historyPath = path.resolve('bundle-monitoring', 'size-history.json');

if (!fs.existsSync(historyPath)) {
  console.error('No bundle size history found. Run a build first.');
  process.exit(1);
}

const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));

// Generate a report
console.log('=== Bundle Size History Report ===');
console.log(\`Total entries: \${history.length}\`);

if (history.length > 0) {
  const latest = history[history.length - 1];
  console.log(\`\\nLatest bundle size (as of \${new Date(latest.timestamp).toLocaleString()}):\`);
  console.log(\`- Total: \${latest.totalSizeKB} KB\`);
  console.log(\`- JS: \${latest.jsSizeKB} KB\`);
  console.log(\`- CSS: \${latest.cssSizeKB} KB\`);
  
  if (latest.largeChunks.length > 0) {
    console.log('\\nLarge chunks:');
    latest.largeChunks.forEach(chunk => {
      console.log(\`- \${chunk.name}: \${chunk.sizeKB} KB\`);
    });
  }
  
  if (history.length > 1) {
    const first = history[0];
    const totalChange = latest.totalSizeKB - first.totalSizeKB;
    const percentChange = (totalChange / first.totalSizeKB) * 100;
    
    console.log(\`\\nChange since first entry (\${new Date(first.timestamp).toLocaleString()}):\`);
    console.log(\`- \${totalChange > 0 ? '+' : ''}\${totalChange} KB (\${percentChange.toFixed(2)}%)\`);
    
    // Show trend
    if (history.length > 2) {
      console.log('\\nSize trend (last 5 entries):');
      const trend = history.slice(-5).map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        size: entry.totalSizeKB
      }));
      
      trend.forEach(entry => {
        console.log(\`- \${entry.date}: \${entry.size} KB\`);
      });
    }
  }
}
    `;
    
    fs.writeFileSync(path.join(monitoringDir, 'generate-report.js'), reportScript);
    
    // Update package.json to include the monitoring scripts
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      'analyze-bundle': 'node analyze-bundle.js',
      'analyze-deps': 'node analyze-dependencies.js',
      'track-bundle': 'node bundle-monitoring/track-bundle-size.js',
      'bundle-report': 'node bundle-monitoring/generate-report.js',
      'build-and-analyze': 'npm run build && npm run analyze-bundle && npm run analyze-deps && npm run track-bundle'
    };
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    
    console.log('Bundle size monitoring setup complete.');
    console.log('New npm scripts added:');
    console.log('- npm run analyze-bundle: Analyze the bundle size');
    console.log('- npm run analyze-deps: Analyze dependencies');
    console.log('- npm run track-bundle: Track bundle size history');
    console.log('- npm run bundle-report: Generate a bundle size report');
    console.log('- npm run build-and-analyze: Build, analyze, and track bundle size');
    
    return true;
  } catch (error) {
    console.error('Error setting up bundle monitoring:', error.message);
    return false;
  }
}

// Run the setup
setupBundleMonitoring();

