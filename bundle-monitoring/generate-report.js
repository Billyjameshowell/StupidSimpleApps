
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
console.log(`Total entries: ${history.length}`);

if (history.length > 0) {
  const latest = history[history.length - 1];
  console.log(`\nLatest bundle size (as of ${new Date(latest.timestamp).toLocaleString()}):`);
  console.log(`- Total: ${latest.totalSizeKB} KB`);
  console.log(`- JS: ${latest.jsSizeKB} KB`);
  console.log(`- CSS: ${latest.cssSizeKB} KB`);
  
  if (latest.largeChunks.length > 0) {
    console.log('\nLarge chunks:');
    latest.largeChunks.forEach(chunk => {
      console.log(`- ${chunk.name}: ${chunk.sizeKB} KB`);
    });
  }
  
  if (history.length > 1) {
    const first = history[0];
    const totalChange = latest.totalSizeKB - first.totalSizeKB;
    const percentChange = (totalChange / first.totalSizeKB) * 100;
    
    console.log(`\nChange since first entry (${new Date(first.timestamp).toLocaleString()}):`);
    console.log(`- ${totalChange > 0 ? '+' : ''}${totalChange} KB (${percentChange.toFixed(2)}%)`);
    
    // Show trend
    if (history.length > 2) {
      console.log('\nSize trend (last 5 entries):');
      const trend = history.slice(-5).map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        size: entry.totalSizeKB
      }));
      
      trend.forEach(entry => {
        console.log(`- ${entry.date}: ${entry.size} KB`);
      });
    }
  }
}
    