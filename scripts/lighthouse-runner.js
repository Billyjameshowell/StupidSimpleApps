const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

class LighthouseRunner {
  constructor() {
    this.config = {
      port: 3000,
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
      outputPath: 'lighthouse-reports',
      historyFile: 'lighthouse-history.json'
    };
    
    this.server = null;
    this.chrome = null;
    this.results = {
      timestamp: new Date().toISOString(),
      scores: {},
      metrics: {},
      audits: []
    };
  }

  async run() {
    console.log('🔦 Starting Lighthouse Testing...\n');
    
    try {
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Build the project
      await this.buildProject();
      
      // Start local server
      await this.startServer();
      
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
      throw new Error('Chrome not found');
    }
    
    // Check for build directory
    if (!fs.existsSync('build')) {
      console.log('  ℹ️ Build directory not found, will create it');
    }
  }

  async buildProject() {
    console.log('\n📦 Building project...');
    
    return new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          console.error('  ❌ Build failed');
          reject(error);
        } else {
          console.log('  ✅ Build completed');
          resolve();
        }
      });
    });
  }

  async startServer() {
    console.log('\n🌐 Starting local server...');
    
    const express = require('express');
    const app = express();
    
    // Serve static files with compression
    app.use(express.static('dist', {
      setHeaders: (res, path) => {
        // Add performance-related headers
        if (path.endsWith('.js') || path.endsWith('.css')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    
    return new Promise((resolve) => {
      this.server = app.listen(this.config.port, () => {
        console.log(`  ✅ Server running at http://localhost:${this.config.port}`);
        resolve();
      });
    });
  }

  async launchChrome() {
    console.log('\n🚀 Launching Chrome...');
    
    this.chrome = await chromeLauncher.launch({
      chromeFlags: this.config.chromeFlags
    });
    
    console.log('  ✅ Chrome launched');
  }

  async runLighthouse() {
    console.log('\n⚡ Running Lighthouse tests...');
    
    const url = `http://localhost:${this.config.port}`;
    
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
    console.log('  🖥️ Testing desktop view...');
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
    const reportsDir = this.config.outputPath;
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save HTML reports
    fs.writeFileSync(
      path.join(reportsDir, `desktop-${timestamp}.html`),
      desktopResult.report[1]
    );
    
    fs.writeFileSync(
      path.join(reportsDir, `mobile-${timestamp}.html`),
      mobileResult.report[1]
    );
    
    // Save JSON reports
    fs.writeFileSync(
      path.join(reportsDir, `desktop-${timestamp}.json`),
      desktopResult.report[0]
    );
    
    fs.writeFileSync(
      path.join(reportsDir, `mobile-${timestamp}.json`),
      mobileResult.report[0]
    );

    // Save baseline reports with specific names
    fs.writeFileSync(
      path.join(reportsDir, `lighthouse-baseline.html`),
      desktopResult.report[1]
    );
    
    fs.writeFileSync(
      path.join(reportsDir, `lighthouse-baseline.json`),
      JSON.stringify({
        desktop: this.results.desktop,
        mobile: this.results.mobile,
        timestamp: this.results.timestamp
      }, null, 2)
    );
  }

  async generateReports() {
    console.log('\n📊 Generating reports...');
    
    const reportPath = 'lighthouse-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Create comparison HTML report
    this.createComparisonReport();
    
    console.log(`  ✅ Reports saved to ${this.config.outputPath}/`);
  }

  createComparisonReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lighthouse Report - ${new Date().toLocaleDateString()}</title>
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
    <h1>🔦 Lighthouse Performance Report</h1>
    <p style="text-align: center; color: #666; margin-bottom: 30px;">
      Generated on ${new Date().toLocaleString()}
    </p>
    
    ${this.renderDeviceSection('Desktop', this.results.desktop)}
    ${this.renderDeviceSection('Mobile', this.results.mobile)}
  </div>
</body>
</html>`;
    
    fs.writeFileSync(
      path.join(this.config.outputPath, 'comparison-report.html'),
      html
    );
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
    console.log('📊 LIGHTHOUSE RESULTS');
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
    console.log(`   • lighthouse-baseline.json - Raw data`);
    console.log(`   • lighthouse-baseline.html - HTML report`);
    console.log(`   • comparison-report.html - Visual comparison`);
    console.log(`   • Individual HTML reports for each device`);
  }

  async cleanup() {
    if (this.chrome) {
      await this.chrome.kill();
    }
    
    if (this.server) {
      this.server.close();
    }
  }
}

// Run Lighthouse tests
const runner = new LighthouseRunner();
runner.run().catch(console.error);

