
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
  
  console.log(`Size change: ${sizeDiff > 0 ? '+' : ''}${sizeDiff} KB (${percentChange.toFixed(2)}%)`);
  
  // Alert on significant increases
  if (sizeDiff > 20) {
    console.warn(`⚠️ WARNING: Bundle size increased by ${sizeDiff} KB (${percentChange.toFixed(2)}%)!`);
  }
}
    