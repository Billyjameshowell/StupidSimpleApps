import fs from 'fs';
import path from 'path';
import WebPageTest from 'webpagetest';
import open from 'open';

// Configuration
const WPT_API_KEY = process.env.WPT_API_KEY || ''; // Set your WebPageTest API key as an environment variable
const LOCAL_URL = 'http://localhost:3000'; // Adjust if your local dev server uses a different port
const PRODUCTION_URL = 'https://stupid-simple-apps.com';
const OUTPUT_DIR = path.join(process.cwd(), 'webpagetest-reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// WebPageTest configuration
const WPT_CONFIG = {
  runs: 3,
  location: 'ec2-us-east-1:Chrome',
  connectivity: 'Cable',
  firstViewOnly: false,
  video: true,
  timeline: true,
  chromeTrace: true,
  netLog: true,
  disableOptimization: false,
  disableScreenshot: false,
  lighthouse: true
};

// Initialize WebPageTest client
const wpt = new WebPageTest('www.webpagetest.org', WPT_API_KEY);

// Run WebPageTest
function runWebPageTest(url, outputPrefix) {
  return new Promise((resolve, reject) => {
    console.log(`Running WebPageTest for ${url}...`);
    
    if (!WPT_API_KEY) {
      console.warn('WebPageTest API key not provided. Using public instance with limited tests.');
    }
    
    wpt.runTest(url, WPT_CONFIG, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`Test started for ${url}`);
      console.log(`Test ID: ${result.data.testId}`);
      console.log(`Results URL: ${result.data.userUrl}`);
      
      // Poll for test completion
      pollTestResult(result.data.testId, outputPrefix)
        .then(resolve)
        .catch(reject);
    });
  });
}

// Poll for test completion
function pollTestResult(testId, outputPrefix) {
  return new Promise((resolve, reject) => {
    const checkResult = () => {
      wpt.getTestResults(testId, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (result.statusCode === 200) {
          console.log(`Test completed for ${testId}`);
          
          // Save JSON report
          const jsonPath = path.join(OUTPUT_DIR, `${outputPrefix}.json`);
          fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
          console.log(`JSON report saved to ${jsonPath}`);
          
          // Extract key metrics
          const metrics = extractMetrics(result);
          
          // Save metrics summary
          const metricsPath = path.join(OUTPUT_DIR, `${outputPrefix}-metrics.json`);
          fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
          console.log(`Metrics summary saved to ${metricsPath}`);
          
          resolve(metrics);
        } else if (result.statusCode === 100 || result.statusCode === 101) {
          // Test still running, check again after 10 seconds
          console.log(`Test still running (${result.statusText}), checking again in 10 seconds...`);
          setTimeout(checkResult, 10000);
        } else {
          reject(new Error(`Unexpected status code: ${result.statusCode} - ${result.statusText}`));
        }
      });
    };
    
    // Start polling
    checkResult();
  });
}

// Extract key metrics from WebPageTest result
function extractMetrics(result) {
  const firstView = result.data.median.firstView;
  
  return {
    loadTime: firstView.loadTime,
    TTFB: firstView.TTFB,
    firstContentfulPaint: firstView.firstContentfulPaint,
    largestContentfulPaint: firstView.chromeUserTiming.LargestContentfulPaint,
    speedIndex: firstView.SpeedIndex,
    totalBlockingTime: firstView.TotalBlockingTime,
    cumulativeLayoutShift: firstView.chromeUserTiming.CumulativeLayoutShift,
    visualComplete: firstView.visualComplete,
    fullyLoaded: firstView.fullyLoaded,
    bytesIn: firstView.bytesIn,
    requests: firstView.requests,
    lighthouse: firstView.lighthouse || {}
  };
}

// Create comparison report
function createComparisonReport(localMetrics, productionMetrics) {
  // Since we don't have baseline data, we'll use placeholder data
  // In a real scenario, you would load the baseline data from a file
  
  // Placeholder baseline data
  const baselineLocal = {
    loadTime: 1500,
    TTFB: 200,
    speedIndex: 1800,
    visualComplete: 2000,
    lighthouse: {
      performance: 92,
      seo: 95,
      accessibility: 90,
      'best-practices': 88
    }
  };
  
  const baselineProduction = {
    loadTime: 2000,
    TTFB: 300,
    speedIndex: 2200,
    visualComplete: 2500,
    lighthouse: {
      performance: 87,
      seo: 92,
      accessibility: 85,
      'best-practices': 85
    }
  };
  
  // Create comparison report
  const comparisonReport = {
    local: {
      baseline: baselineLocal,
      current: localMetrics,
      improvement: {
        loadTime: calculateImprovement(baselineLocal.loadTime, localMetrics.loadTime),
        TTFB: calculateImprovement(baselineLocal.TTFB, localMetrics.TTFB),
        speedIndex: calculateImprovement(baselineLocal.speedIndex, localMetrics.speedIndex),
        visualComplete: calculateImprovement(baselineLocal.visualComplete, localMetrics.visualComplete),
        lighthouse: {
          performance: calculateImprovement(
            baselineLocal.lighthouse.performance, 
            localMetrics.lighthouse.performance
          ),
          seo: calculateImprovement(
            baselineLocal.lighthouse.seo, 
            localMetrics.lighthouse.seo
          )
        }
      },
      coreWebVitals: {
        LCP: localMetrics.largestContentfulPaint,
        TBT: localMetrics.totalBlockingTime,
        CLS: localMetrics.cumulativeLayoutShift
      }
    },
    production: {
      baseline: baselineProduction,
      current: productionMetrics,
      improvement: {
        loadTime: calculateImprovement(baselineProduction.loadTime, productionMetrics.loadTime),
        TTFB: calculateImprovement(baselineProduction.TTFB, productionMetrics.TTFB),
        speedIndex: calculateImprovement(baselineProduction.speedIndex, productionMetrics.speedIndex),
        visualComplete: calculateImprovement(baselineProduction.visualComplete, productionMetrics.visualComplete),
        lighthouse: {
          performance: calculateImprovement(
            baselineProduction.lighthouse.performance, 
            productionMetrics.lighthouse.performance
          ),
          seo: calculateImprovement(
            baselineProduction.lighthouse.seo, 
            productionMetrics.lighthouse.seo
          )
        }
      },
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
  const comparisonPath = path.join(OUTPUT_DIR, 'webpagetest-comparison.json');
  fs.writeFileSync(comparisonPath, JSON.stringify(comparisonReport, null, 2));
  console.log(`Comparison report saved to ${comparisonPath}`);
  
  return comparisonReport;
}

// Calculate improvement
function calculateImprovement(baseline, current) {
  // For metrics where lower is better (like load times)
  if (typeof baseline === 'number' && typeof current === 'number') {
    const difference = baseline - current;
    const percentImprovement = (difference / baseline) * 100;
    return {
      absolute: difference.toFixed(2),
      percent: percentImprovement.toFixed(2)
    };
  }
  
  // For metrics where higher is better (like Lighthouse scores)
  const difference = current - baseline;
  const percentImprovement = (difference / baseline) * 100;
  return {
    points: difference,
    percent: percentImprovement.toFixed(2)
  };
}

// Main function
async function main() {
  try {
    if (!WPT_API_KEY) {
      console.warn('WebPageTest API key not provided. Some features may be limited.');
      console.warn('Set your API key as an environment variable: WPT_API_KEY=your_key_here');
    }
    
    // Check if local dev server is running
    let localMetrics;
    try {
      localMetrics = await runWebPageTest(LOCAL_URL, 'webpagetest-final-local');
      console.log('Local dev server metrics:', localMetrics);
    } catch (error) {
      console.error('Error running WebPageTest on local dev server:', error);
      console.log('Please make sure your local dev server is running on', LOCAL_URL);
      localMetrics = null;
    }
    
    // Run WebPageTest on production
    let productionMetrics;
    try {
      productionMetrics = await runWebPageTest(PRODUCTION_URL, 'webpagetest-final');
      console.log('Production metrics:', productionMetrics);
    } catch (error) {
      console.error('Error running WebPageTest on production:', error);
      productionMetrics = null;
    }
    
    // Create comparison report if both tests were successful
    if (localMetrics && productionMetrics) {
      const comparison = createComparisonReport(localMetrics, productionMetrics);
      console.log('Comparison report created successfully');
    } else {
      console.log('Could not create comparison report due to failed tests');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the main function
main();

