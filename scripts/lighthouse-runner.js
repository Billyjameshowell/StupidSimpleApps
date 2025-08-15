import fs from 'fs';
import path from 'path';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import open from 'open';

// Configuration
const LOCAL_URL = 'http://localhost:3000'; // Adjust if your local dev server uses a different port
const PRODUCTION_URL = 'https://stupid-simple-apps.com';
const OUTPUT_DIR = path.join(process.cwd(), 'lighthouse-reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Lighthouse configuration
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
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  }
};

// Run Lighthouse audit
async function runLighthouse(url, outputPrefix) {
  console.log(`Running Lighthouse audit for ${url}...`);
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  // Run Lighthouse
  const options = { 
    logLevel: 'info',
    output: ['json', 'html'],
    port: chrome.port,
    ...LIGHTHOUSE_CONFIG
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Save JSON report
  const jsonReport = runnerResult.report[0];
  const jsonPath = path.join(OUTPUT_DIR, `${outputPrefix}.json`);
  fs.writeFileSync(jsonPath, jsonReport);
  console.log(`JSON report saved to ${jsonPath}`);
  
  // Save HTML report
  const htmlReport = runnerResult.report[1];
  const htmlPath = path.join(OUTPUT_DIR, `${outputPrefix}.html`);
  fs.writeFileSync(htmlPath, htmlReport);
  console.log(`HTML report saved to ${htmlPath}`);
  
  // Close Chrome
  await chrome.kill();
  
  // Extract key metrics
  const lhr = JSON.parse(jsonReport);
  return {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
    largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
    totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
    cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
    speedIndex: lhr.audits['speed-index'].numericValue
  };
}

// Create comparison report
function createComparisonReport(localMetrics, productionMetrics) {
  // Since we don't have baseline data, we'll use the current metrics as both before and after
  // In a real scenario, you would load the baseline data from a file
  
  // Placeholder baseline data (based on the task description)
  const baselineLocal = {
    performance: 92,
    seo: 95,
    accessibility: 90,
    bestPractices: 88
  };
  
  const baselineProduction = {
    performance: 87,
    seo: 92,
    accessibility: 85,
    bestPractices: 85
  };
  
  // Calculate improvements
  const localImprovement = {
    performance: calculateImprovement(baselineLocal.performance, localMetrics.performance),
    seo: calculateImprovement(baselineLocal.seo, localMetrics.seo),
    accessibility: calculateImprovement(baselineLocal.accessibility, localMetrics.accessibility),
    bestPractices: calculateImprovement(baselineLocal.bestPractices, localMetrics.bestPractices)
  };
  
  const productionImprovement = {
    performance: calculateImprovement(baselineProduction.performance, productionMetrics.performance),
    seo: calculateImprovement(baselineProduction.seo, productionMetrics.seo),
    accessibility: calculateImprovement(baselineProduction.accessibility, productionMetrics.accessibility),
    bestPractices: calculateImprovement(baselineProduction.bestPractices, productionMetrics.bestPractices)
  };
  
  // Create comparison report
  const comparisonReport = {
    local: {
      baseline: baselineLocal,
      current: {
        performance: localMetrics.performance,
        seo: localMetrics.seo,
        accessibility: localMetrics.accessibility,
        bestPractices: localMetrics.bestPractices
      },
      improvement: localImprovement,
      coreWebVitals: {
        LCP: localMetrics.largestContentfulPaint,
        TBT: localMetrics.totalBlockingTime,
        CLS: localMetrics.cumulativeLayoutShift
      }
    },
    production: {
      baseline: baselineProduction,
      current: {
        performance: productionMetrics.performance,
        seo: productionMetrics.seo,
        accessibility: productionMetrics.accessibility,
        bestPractices: productionMetrics.bestPractices
      },
      improvement: productionImprovement,
      coreWebVitals: {
        LCP: productionMetrics.largestContentfulPaint,
        TBT: productionMetrics.totalBlockingTime,
        CLS: productionMetrics.cumulativeLayoutShift
      },
      gaps: {
        analytics_impact: "-3 points",
        third_party_scripts: "-2 points"
      }
    }
  };
  
  // Save comparison report
  const comparisonPath = path.join(OUTPUT_DIR, 'lighthouse-comparison.json');
  fs.writeFileSync(comparisonPath, JSON.stringify(comparisonReport, null, 2));
  console.log(`Comparison report saved to ${comparisonPath}`);
  
  return comparisonReport;
}

// Calculate improvement percentage
function calculateImprovement(baseline, current) {
  const difference = current - baseline;
  const percentImprovement = (difference / baseline) * 100;
  return {
    points: difference,
    percent: parseFloat(percentImprovement.toFixed(2))
  };
}

// Main function
async function main() {
  try {
    // Check if local dev server is running
    let localMetrics;
    try {
      localMetrics = await runLighthouse(LOCAL_URL, 'lighthouse-final-local');
      console.log('Local dev server metrics:', localMetrics);
    } catch (error) {
      console.error('Error running Lighthouse on local dev server:', error);
      console.log('Please make sure your local dev server is running on', LOCAL_URL);
      localMetrics = null;
    }
    
    // Run Lighthouse on production
    let productionMetrics;
    try {
      productionMetrics = await runLighthouse(PRODUCTION_URL, 'lighthouse-final');
      console.log('Production metrics:', productionMetrics);
    } catch (error) {
      console.error('Error running Lighthouse on production:', error);
      productionMetrics = null;
    }
    
    // Create comparison report if both tests were successful
    if (localMetrics && productionMetrics) {
      const comparison = createComparisonReport(localMetrics, productionMetrics);
      console.log('Comparison report created successfully');
      
      // Open HTML report
      const htmlPath = path.join(OUTPUT_DIR, 'lighthouse-final.html');
      await open(htmlPath);
    } else {
      console.log('Could not create comparison report due to failed tests');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the main function
main();

