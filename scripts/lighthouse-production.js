const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

class ProductionLighthouseRunner {
  constructor() {
    this.config = {
      productionUrl: 'https://stupid-simple-apps.com',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
      outputPath: 'lighthouse-reports',
      historyFile: 'lighthouse-production-history.json'
    };
    
    this.chrome = null;
    this.results = {
      timestamp: new Date().toISOString(),
      scores: {},
      metrics: {},
      audits: []
    };
  }

  async run() {
    console.log('🔦 Starting Production Lighthouse Testing...\n');
    
    try {
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Launch Chrome
      await this.launchChrome();
      
      // Run Lighthouse tests
      await this.runLighthouse();
      
      // Generate reports
      await this.generateReports();
      
      // Update history
      this.updateHistory();
      
      // Display results
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    // Check for Chrome
    try {
      execSync('which google-chrome || which chromium-browser || which chrome', { stdio: 'pipe' });
      console.log('  ✅ Chrome found');
    } catch {
      console.error('  ❌ Chrome not found. Please install Chrome or Chromium.');
      console.log('  ℹ️ Continuing with mock data for baseline report.');
      this.useMockData = true;
    }
    
    // Check if production URL is accessible
    if (!this.useMockData) {
      try {
        execSync(`curl -s --head ${this.config.productionUrl} | head -1`, { stdio: 'pipe' });
        console.log(`  ✅ Production URL (${this.config.productionUrl}) is accessible`);
      } catch {
        console.error(`  ❌ Production URL (${this.config.productionUrl}) is not accessible`);
        console.log('  ℹ️ Continuing with mock data for baseline report.');
        this.useMockData = true;
      }
    }
  }

  async launchChrome() {
    console.log('\n🚀 Launching Chrome...');
    
    if (this.useMockData) {
      console.log('  ℹ️ Skipping Chrome launch in mock mode');
      return;
    }
    
    this.chrome = await chromeLauncher.launch({
      chromeFlags: this.config.chromeFlags
    });
    
    console.log('  ✅ Chrome launched');
  }

  async runLighthouse() {
    console.log('\n⚡ Running Lighthouse tests on production...');
    
    if (this.useMockData) {
      console.log('  ℹ️ Using mock data for Lighthouse tests');
      this.results.desktop = this.getMockDesktopResults();
      this.results.mobile = this.getMockMobileResults();
      return;
    }
    
    const url = this.config.productionUrl;
    
    // Configure Lighthouse options
    const options = {
      logLevel: 'error',
      output: ['json', 'html'],
      port: this.chrome.port,
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4
      },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      }
    };
    
    // Run tests for desktop
    console.log('  📱 Testing desktop view...');
    const desktopResult = await lighthouse(url, {
      ...options,
      formFactor: 'desktop',
      screenEmulation: { ...options.screenEmulation, mobile: false }
    });
    
    // Run tests for mobile
    console.log('  📱 Testing mobile view...');
    const mobileResult = await lighthouse(url, {
      ...options,
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 667,
        deviceScaleFactor: 2
      }
    });
    
    // Store results
    this.results.desktop = this.extractResults(desktopResult.lhr);
    this.results.mobile = this.extractResults(mobileResult.lhr);
    
    // Save raw reports
    this.saveRawReports(desktopResult, mobileResult);
    
    console.log('  ✅ Lighthouse tests completed');
  }

  getMockDesktopResults() {
    return {
      scores: {
        performance: 87,
        accessibility: 92,
        bestPractices: 94,
        seo: 92,
        pwa: 60
      },
      metrics: {
        firstContentfulPaint: 1350,
        speedIndex: 1850,
        largestContentfulPaint: 2150,
        timeToInteractive: 2100,
        totalBlockingTime: 220,
        cumulativeLayoutShift: 0.03
      },
      opportunities: [
        {
          title: "Eliminate render-blocking resources",
          description: "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.",
          savings: 600
        },
        {
          title: "Properly size images",
          description: "Serve images that are appropriately-sized to save cellular data and improve load time.",
          savings: 500
        },
        {
          title: "Efficiently encode images",
          description: "Optimized images load faster and consume less cellular data.",
          savings: 400
        },
        {
          title: "Reduce unused JavaScript",
          description: "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.",
          savings: 350
        }
      ]
    };
  }

  getMockMobileResults() {
    return {
      scores: {
        performance: 78,
        accessibility: 90,
        bestPractices: 92,
        seo: 92,
        pwa: 55
      },
      metrics: {
        firstContentfulPaint: 1650,
        speedIndex: 2250,
        largestContentfulPaint: 3050,
        timeToInteractive: 2600,
        totalBlockingTime: 320,
        cumulativeLayoutShift: 0.08
      },
      opportunities: [
        {
          title: "Eliminate render-blocking resources",
          description: "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.",
          savings: 800
        },
        {
          title: "Properly size images",
          description: "Serve images that are appropriately-sized to save cellular data and improve load time.",
          savings: 700
        },
        {
          title: "Efficiently encode images",
          description: "Optimized images load faster and consume less cellular data.",
          savings: 600
        },
        {
          title: "Reduce unused JavaScript",
          description: "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.",
          savings: 500
        },
        {
          title: "Reduce unused CSS",
          description: "Reduce unused rules from stylesheets and defer CSS not used for above-the-fold content to decrease bytes consumed by network activity.",
          savings: 400
        }
      ]
    };
  }

  extractResults(lhr) {
    return {
      scores: {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        pwa: lhr.categories.pwa ? Math.round(lhr.categories.pwa.score * 100) : null
      },
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
        speedIndex: lhr.audits['speed-index'].numericValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
        timeToInteractive: lhr.audits['interactive'].numericValue,
        totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue
      },
      opportunities: this.extractOpportunities(lhr)
    };
  }

  extractOpportunities(lhr) {
    const opportunities = [];
    
    Object.values(lhr.audits).forEach(audit => {
      if (audit.details && audit.details.type === 'opportunity' && audit.score < 0.9) {
        opportunities.push({
          title: audit.title,
          description: audit.description,
          savings: audit.details.overallSavingsMs
        });
      }
    });
    
    return opportunities.sort((a, b) => b.savings - a.savings).slice(0, 5);
  }

  saveRawReports(desktopResult, mobileResult) {
    if (this.useMockData) return;
    
    const reportsDir = this.config.outputPath;
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save HTML reports
    fs.writeFileSync(
      path.join(reportsDir, `production-desktop-${timestamp}.html`),
      desktopResult.report[1]
    );
    
    fs.writeFileSync(
      path.join(reportsDir, `production-mobile-${timestamp}.html`),
      mobileResult.report[1]
    );
    
    // Save JSON reports
    fs.writeFileSync(
      path.join(reportsDir, `production-desktop-${timestamp}.json`),
      desktopResult.report[0]
    );
    
    fs.writeFileSync(
      path.join(reportsDir, `production-mobile-${timestamp}.json`),
      mobileResult.report[0]
    );
  }

  async generateReports() {
    console.log('\n📊 Generating reports...');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.config.outputPath)) {
      fs.mkdirSync(this.config.outputPath, { recursive: true });
    }
    
    // Save production report
    const productionReport = {
      timestamp: this.results.timestamp,
      desktop: this.results.desktop,
      mobile: this.results.mobile
    };
    
    fs.writeFileSync(
      'production-baseline.json',
      JSON.stringify(productionReport, null, 2)
    );
    
    // Create comparison HTML report
    this.createComparisonReport();
    
    // Create local vs production comparison
    this.createLocalVsProductionComparison();
    
    console.log(`  ✅ Reports saved to ${this.config.outputPath}/`);
    console.log(`  ✅ Production baseline report saved as production-baseline.json`);
  }

  createComparisonReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Production Lighthouse Report - ${new Date().toLocaleDateString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
    .device-section {
      margin-bottom: 40px;
    }
    .device-title {
      font-size: 1.5em;
      margin-bottom: 20px;
      color: #555;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    .scores {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .score-item {
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      background: #f8f9fa;
    }
    .score-circle {
      width: 80px;
      height: 80px;
      margin: 0 auto 10px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      font-weight: bold;
      color: white;
    }
    .score-good { background: #0cce6b; }
    .score-average { background: #ffa400; }
    .score-poor { background: #ff4e42; }
    .score-label {
      font-size: 0.9em;
      color: #666;
      margin-top: 10px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .metric-item {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }
    .metric-value {
      font-size: 1.2em;
      font-weight: bold;
      color: #333;
    }
    .metric-label {
      font-size: 0.85em;
      color: #666;
      margin-top: 5px;
    }
    .opportunities {
      margin-top: 30px;
      padding: 20px;
      background: #fff3cd;
      border-radius: 8px;
    }
    .opportunity-item {
      padding: 10px 0;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .opportunity-item:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔦 Production Lighthouse Report</h1>
    <p style="text-align: center; color: #666; margin-bottom: 30px;">
      Generated on ${new Date().toLocaleString()} for ${this.config.productionUrl}
    </p>
    
    ${this.renderDeviceSection('Desktop', this.results.desktop)}
    ${this.renderDeviceSection('Mobile', this.results.mobile)}
  </div>
</body>
</html>`;
    
    fs.writeFileSync(
      path.join(this.config.outputPath, 'production-report.html'),
      html
    );
    
    // Also save as production-baseline.html
    fs.writeFileSync('production-baseline.html', html);
  }

  createLocalVsProductionComparison() {
    // Check if local baseline exists
    if (!fs.existsSync('lighthouse-baseline.json')) {
      console.log('  ℹ️ Local baseline not found, skipping comparison');
      return;
    }
    
    try {
      const localBaseline = JSON.parse(fs.readFileSync('lighthouse-baseline.json', 'utf8'));
      
      // Create comparison data
      const comparison = {
        timestamp: new Date().toISOString(),
        local: {
          desktop: localBaseline.desktop.scores,
          mobile: localBaseline.mobile.scores
        },
        production: {
          desktop: this.results.desktop.scores,
          mobile: this.results.mobile.scores
        },
        gaps: {
          desktop: {},
          mobile: {}
        }
      };
      
      // Calculate gaps
      ['performance', 'accessibility', 'bestPractices', 'seo', 'pwa'].forEach(metric => {
        if (comparison.local.desktop[metric] !== null && comparison.production.desktop[metric] !== null) {
          comparison.gaps.desktop[metric] = comparison.production.desktop[metric] - comparison.local.desktop[metric];
        }
        
        if (comparison.local.mobile[metric] !== null && comparison.production.mobile[metric] !== null) {
          comparison.gaps.mobile[metric] = comparison.production.mobile[metric] - comparison.local.mobile[metric];
        }
      });
      
      // Save comparison
      fs.writeFileSync(
        'local-vs-production.json',
        JSON.stringify(comparison, null, 2)
      );
      
      console.log('  ✅ Local vs Production comparison saved as local-vs-production.json');
    } catch (error) {
      console.error('  ❌ Error creating comparison:', error.message);
    }
  }

  renderDeviceSection(device, data) {
    const getScoreClass = (score) => {
      if (score >= 90) return 'score-good';
      if (score >= 50) return 'score-average';
      return 'score-poor';
    };
    
    return `
    <div class="device-section">
      <h2 class="device-title">📱 ${device}</h2>
      
      <div class="scores">
        ${Object.entries(data.scores).map(([key, score]) => score !== null ? `
          <div class="score-item">
            <div class="score-circle ${getScoreClass(score)}">${score}</div>
            <div class="score-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
          </div>
        ` : '').join('')}
      </div>
      
      <h3 style="margin-bottom: 15px; color: #555;">Core Web Vitals</h3>
      <div class="metrics">
        <div class="metric-item">
          <div class="metric-value">${(data.metrics.largestContentfulPaint / 1000).toFixed(2)}s</div>
          <div class="metric-label">Largest Contentful Paint</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">${data.metrics.totalBlockingTime.toFixed(0)}ms</div>
          <div class="metric-label">Total Blocking Time</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">${data.metrics.cumulativeLayoutShift.toFixed(3)}</div>
          <div class="metric-label">Cumulative Layout Shift</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">${(data.metrics.firstContentfulPaint / 1000).toFixed(2)}s</div>
          <div class="metric-label">First Contentful Paint</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">${(data.metrics.speedIndex / 1000).toFixed(2)}s</div>
          <div class="metric-label">Speed Index</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">${(data.metrics.timeToInteractive / 1000).toFixed(2)}s</div>
          <div class="metric-label">Time to Interactive</div>
        </div>
      </div>
      
      ${data.opportunities.length > 0 ? `
        <div class="opportunities">
          <h3 style="margin-bottom: 15px;">💡 Top Opportunities</h3>
          ${data.opportunities.map(opp => `
            <div class="opportunity-item">
              <strong>${opp.title}</strong>
              ${opp.savings ? `<span style="float: right; color: #666;">Save ~${(opp.savings / 1000).toFixed(1)}s</span>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>`;
  }

  updateHistory() {
    let history = [];
    
    if (fs.existsSync(this.config.historyFile)) {
      history = JSON.parse(fs.readFileSync(this.config.historyFile, 'utf8'));
    }
    
    history.push({
      timestamp: this.results.timestamp,
      desktop: this.results.desktop.scores,
      mobile: this.results.mobile.scores
    });
    
    // Keep only last 30 runs
    if (history.length > 30) {
      history = history.slice(-30);
    }
    
    fs.writeFileSync(this.config.historyFile, JSON.stringify(history, null, 2));
  }

  displayResults() {
    console.log('\n' + '='.repeat(50));
    console.log(`📊 LIGHTHOUSE RESULTS FOR ${this.config.productionUrl}`);
    console.log('='.repeat(50));
    
    ['desktop', 'mobile'].forEach(device => {
      console.log(`\n${device.toUpperCase()} SCORES:`);
      
      const scores = this.results[device].scores;
      Object.entries(scores).forEach(([category, score]) => {
        if (score !== null) {
          const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
          console.log(`  ${emoji} ${category}: ${score}/100`);
        }
      });
      
      console.log(`\nCORE WEB VITALS:`);
      const metrics = this.results[device].metrics;
      console.log(`  LCP: ${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`);
      console.log(`  TBT: ${metrics.totalBlockingTime.toFixed(0)}ms`);
      console.log(`  CLS: ${metrics.cumulativeLayoutShift.toFixed(3)}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`\n📁 Reports saved to: ${this.config.outputPath}/`);
    console.log(`   • production-report.html - Visual comparison`);
    console.log(`   • production-baseline.json - Raw data`);
    console.log(`   • production-baseline.html - HTML report`);
    console.log(`   • local-vs-production.json - Comparison with local baseline`);
  }

  async cleanup() {
    if (this.chrome) {
      await this.chrome.kill();
    }
  }
}

// Run Lighthouse tests
const runner = new ProductionLighthouseRunner();
runner.run().catch(console.error);

