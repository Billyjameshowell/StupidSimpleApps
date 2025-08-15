const { execSync } = require('child_process');
const open = require('open');

console.log('🚀 Running quick Lighthouse test...\n');

try {
  // Check if server is already running
  const isServerRunning = () => {
    try {
      execSync('curl -s http://localhost:3000', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  };

  if (isServerRunning()) {
    console.log('Using existing server on port 3000...');
  } else {
    console.log('Starting local server...');
    require('child_process').spawn('npm', ['start'], {
      detached: true,
      stdio: 'ignore'
    }).unref();
    
    // Wait for server to start
    console.log('Waiting for server...');
    execSync('sleep 5');
  }

  // Check if Chrome is available
  try {
    execSync('which google-chrome || which chromium-browser || which chrome', { stdio: 'pipe' });
    
    // Run Lighthouse
    console.log('Running Lighthouse...\n');
    execSync('npx lighthouse http://localhost:3000 --view', { stdio: 'inherit' });
  } catch {
    console.error('Chrome not found. Please install Chrome or Chromium to run Lighthouse tests.');
    console.log('Lighthouse skipped - Chrome not found');
  }
  
} catch (error) {
  console.error('Error:', error.message);
}

