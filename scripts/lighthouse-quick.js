import fs from 'fs';
import path from 'path';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

// Configuration
const PRODUCTION_URL = 'https://stupid-simple-apps.com';
const OUTPUT_DIR = path.join(process.cwd(), 'lighthouse-reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Lighthouse configuration - only performance category for quick test
const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    onlyCategories: ['performance']
  }
};

// Run Lighthouse audit
async function runLighthouse(url, outputPrefix) {
  console.log(`Running quick Lighthouse audit for ${url}...`);
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  // Run Lighthouse
  const options = { 
    logLevel: 'info',
    output: ['json'],
    port: chrome.port,
    ...LIGHTHOUSE_CONFIG
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Save JSON report
  const jsonReport = runnerResult.report[0];
  const jsonPath = path.join(OUTPUT_DIR, `${outputPrefix}.json`);
  fs.writeFileSync(jsonPath, jsonReport);
  console.log(`JSON report saved to ${jsonPath}`);
  
  // Close Chrome
  await chrome.kill();
  
  // Extract key metrics
  const lhr = JSON.parse(jsonReport);
  const metrics = {
    performance: Math.round(lhr.categories.performance.score * 100),
    firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
    largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
    totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
    cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
    speedIndex: lhr.audits['speed-index'].numericValue
  };
  
  console.log('Quick performance metrics:', metrics);
  return metrics;
}

// Main function
async function main() {
  try {
    // Run Lighthouse on production
    await runLighthouse(PRODUCTION_URL, 'lighthouse-quick');
    console.log('Quick Lighthouse test completed successfully');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the main function
main();

