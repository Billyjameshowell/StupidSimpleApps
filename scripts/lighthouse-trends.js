import fs from 'fs';
import path from 'path';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

// Configuration
const PRODUCTION_URL = 'https://stupid-simple-apps.com';
const OUTPUT_DIR = path.join(process.cwd(), 'lighthouse-reports');
const TRENDS_FILE = path.join(OUTPUT_DIR, 'lighthouse-trends.json');

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
async function runLighthouse(url) {
  console.log(`Running Lighthouse audit for ${url}...`);
  
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
  
  // Close Chrome
  await chrome.kill();
  
  // Extract key metrics
  const lhr = JSON.parse(runnerResult.report[0]);
  return {
    timestamp: new Date().toISOString(),
    url: url,
    scores: {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100)
    },
    metrics: {
      firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
      totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
      cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
      speedIndex: lhr.audits['speed-index'].numericValue
    }
  };
}

// Update trends file
function updateTrends(metrics) {
  let trends = [];
  
  // Load existing trends if file exists
  if (fs.existsSync(TRENDS_FILE)) {
    try {
      const trendsData = fs.readFileSync(TRENDS_FILE, 'utf8');
      trends = JSON.parse(trendsData);
    } catch (error) {
      console.error('Error reading trends file:', error);
    }
  }
  
  // Add new metrics
  trends.push(metrics);
  
  // Save updated trends
  fs.writeFileSync(TRENDS_FILE, JSON.stringify(trends, null, 2));
  console.log(`Trends updated in ${TRENDS_FILE}`);
  
  // Generate trends summary
  const summary = generateTrendsSummary(trends);
  const summaryPath = path.join(OUTPUT_DIR, 'lighthouse-trends-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Trends summary saved to ${summaryPath}`);
  
  return summary;
}

// Generate trends summary
function generateTrendsSummary(trends) {
  if (trends.length === 0) {
    return { error: 'No trend data available' };
  }
  
  // Get the most recent 10 entries (or all if less than 10)
  const recentTrends = trends.slice(-10);
  
  // Calculate averages for recent entries
  const averages = {
    performance: calculateAverage(recentTrends.map(t => t.scores.performance)),
    accessibility: calculateAverage(recentTrends.map(t => t.scores.accessibility)),
    bestPractices: calculateAverage(recentTrends.map(t => t.scores.bestPractices)),
    seo: calculateAverage(recentTrends.map(t => t.scores.seo)),
    firstContentfulPaint: calculateAverage(recentTrends.map(t => t.metrics.firstContentfulPaint)),
    largestContentfulPaint: calculateAverage(recentTrends.map(t => t.metrics.largestContentfulPaint)),
    totalBlockingTime: calculateAverage(recentTrends.map(t => t.metrics.totalBlockingTime)),
    cumulativeLayoutShift: calculateAverage(recentTrends.map(t => t.metrics.cumulativeLayoutShift)),
    speedIndex: calculateAverage(recentTrends.map(t => t.metrics.speedIndex))
  };
  
  // Calculate trends (comparing first and last entry)
  const first = trends[0];
  const last = trends[trends.length - 1];
  
  const trendChanges = {
    performance: calculateChange(first.scores.performance, last.scores.performance),
    accessibility: calculateChange(first.scores.accessibility, last.scores.accessibility),
    bestPractices: calculateChange(first.scores.bestPractices, last.scores.bestPractices),
    seo: calculateChange(first.scores.seo, last.scores.seo),
    firstContentfulPaint: calculateChange(first.metrics.firstContentfulPaint, last.metrics.firstContentfulPaint, true),
    largestContentfulPaint: calculateChange(first.metrics.largestContentfulPaint, last.metrics.largestContentfulPaint, true),
    totalBlockingTime: calculateChange(first.metrics.totalBlockingTime, last.metrics.totalBlockingTime, true),
    cumulativeLayoutShift: calculateChange(first.metrics.cumulativeLayoutShift, last.metrics.cumulativeLayoutShift, true),
    speedIndex: calculateChange(first.metrics.speedIndex, last.metrics.speedIndex, true)
  };
  
  return {
    dataPoints: trends.length,
    firstDate: first.timestamp,
    lastDate: last.timestamp,
    currentScores: last.scores,
    averages: averages,
    trendChanges: trendChanges
  };
}

// Calculate average
function calculateAverage(values) {
  const sum = values.reduce((total, value) => total + value, 0);
  return parseFloat((sum / values.length).toFixed(2));
}

// Calculate change
function calculateChange(first, last, lowerIsBetter = false) {
  const difference = last - first;
  const percentChange = (difference / first) * 100;
  
  // For metrics where lower is better (like load times), invert the sign
  const adjustedDifference = lowerIsBetter ? -difference : difference;
  const adjustedPercentChange = lowerIsBetter ? -percentChange : percentChange;
  
  return {
    absolute: parseFloat(adjustedDifference.toFixed(2)),
    percent: parseFloat(adjustedPercentChange.toFixed(2)),
    improved: lowerIsBetter ? last < first : last > first
  };
}

// Main function
async function main() {
  try {
    // Run Lighthouse on production
    const metrics = await runLighthouse(PRODUCTION_URL);
    console.log('Lighthouse metrics:', metrics);
    
    // Update trends
    const summary = updateTrends(metrics);
    console.log('Trends summary:', summary);
    
    console.log('Lighthouse trends updated successfully');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the main function
main();

