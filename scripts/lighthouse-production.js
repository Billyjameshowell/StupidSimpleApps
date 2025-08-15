const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

class ProductionLighthouseRunner {
  constructor() {
    this.config = {
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
      outputPath: 'lighthouse-reports',
      productionUrl: 'https://stupid-simple-apps.com'
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
      const { execSync } = require('child_process');
      execSync('which google-chrome || which chromium-browser || which chrome', { stdio: 'pipe' });
      console.log('  ✅ Chrome found');
    } catch {
      console.error('  ❌ Chrome not found. Please install Chrome or Chromium.');
      throw new Error('Chrome not found');
    }
  }

  async launchChrome() {
    console.log('\n🚀 Launching Chrome...');
    
    this.chrome = await chromeLauncher.launch({
      chromeFlags: this.config.chromeFlags
    });
    
    console.log('  ✅ Chrome launched');
  }

  async runLighthouse() {
    console.log('\n⚡ Running Lighthouse tests on production site...');
    
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
      opportunities: this.extractOpportunities(lhr),
      thirdPartyImpact: this.extractThirdPartyImpact(lhr)
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

  extractThirdPartyImpact(lhr) {
    const thirdPartyImpact = {
      totalBytes: 0,
      totalBlockingTime: 0,
      items: []
    };
    
    // Check if third-party-summary audit exists
    if (lhr.audits['third-party-summary'] && 
        lhr.audits['third-party-summary'].details && 
        lhr.audits['third-party-summary'].details.items) {
      
      const items = lhr.audits['third-party-summary'].details.items;
      
      items.forEach(item => {
        thirdPartyImpact.items.push({
          name: item.entity?.text || 'Unknown',
          blockingTime: item.blockingTime || 0,
          transferSize: item.transferSize || 0
        });
        
        thirdPartyImpact.totalBytes += item.transferSize || 0;
        thirdPartyImpact.totalBlockingTime += item.blockingTime || 0;
      });
    }
    
    return thirdPartyImpact;
  }

  saveRawReports(desktopResult, mobileResult) {
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

    // Save production baseline report
    fs.writeFileSync(
      path.join(reportsDir, `production-baseline.json`),
      JSON.stringify({
        desktop: this.results.desktop,
        mobile: this.results.mobile,
        timestamp: this.results.timestamp,
        url: this.config.productionUrl
      }, null, 2)
    );
  }

  async generateReports() {
    console.log('\n📊 Generating reports...');
    
    // Create comparison report with local vs production
    this.createComparisonWithLocal();
    
    console.log(`  ✅ Reports saved to ${this.config.outputPath}/`);
  }

  createComparisonWithLocal() {
    // Check if local baseline exists
    const localBaselinePath = path.join(this.config.outputPath, 'lighthouse-baseline.json');
    
    if (!fs.existsSync(localBaselinePath)) {
      console.log('  ⚠️ Local baseline not found. Run local tests first.');
      return;
    }
    
    // Load local baseline
    const localBaseline = JSON.parse(fs.readFileSync(localBaselinePath, 'utf8'));
    
    // Create comparison data
    const comparison = {
      timestamp: this.results.timestamp,
      local: {
        desktop: localBaseline.desktop.scores,
        mobile: localBaseline.mobile.scores
      },
      production: {
        desktop: this.results.desktop.scores,
        mobile: this.results.mobile.scores
      },
      gaps: this.calculateGaps(localBaseline, this.results)
    };
    
    // Save comparison report
    fs.writeFileSync(
      path.join(this.config.outputPath, 'local-vs-production.json'),
      JSON.stringify(comparison, null, 2)
    );
  }

  calculateGaps(local, production) {
    const gaps = {
      desktop: {},
      mobile: {},
      analysis: {
        analytics_impact: "0 points",
        third_party_scripts: "0 points"
      }
    };
    
    // Calculate score differences
    ['desktop', 'mobile'].forEach(device => {
      Object.keys(local[device].scores).forEach(metric => {
        if (local[device].scores[metric] !== null && production[device].scores[metric] !== null) {
          gaps[device][metric] = production[device].scores[metric] - local[device].scores[metric];
        }
      });
    });
    
    // Analyze third-party impact
    const thirdPartyImpact = production.desktop.thirdPartyImpact || { totalBlockingTime: 0 };
    
    if (thirdPartyImpact.totalBlockingTime > 200) {
      gaps.analysis.third_party_scripts = `-${Math.round(thirdPartyImpact.totalBlockingTime / 100)} points`;
    } else if (thirdPartyImpact.totalBlockingTime > 0) {
      gaps.analysis.third_party_scripts = `-${Math.round(thirdPartyImpact.totalBlockingTime / 200)} points`;
    }
    
    // Estimate analytics impact
    const hasAnalytics = thirdPartyImpact.items && thirdPartyImpact.items.some(item => 
      item.name.toLowerCase().includes('google') || 
      item.name.toLowerCase().includes('analytics') ||
      item.name.toLowerCase().includes('tag manager')
    );
    
    if (hasAnalytics) {
      gaps.analysis.analytics_impact = "-3 points";
    }
    
    return gaps;
  }

  displayResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 PRODUCTION LIGHTHOUSE RESULTS');
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
    
    // Display third-party impact
    if (this.results.desktop.thirdPartyImpact && this.results.desktop.thirdPartyImpact.items.length > 0) {
      console.log('\nTHIRD-PARTY IMPACT:');
      console.log(`  Total Blocking Time: ${this.results.desktop.thirdPartyImpact.totalBlockingTime.toFixed(0)}ms`);
      console.log(`  Total Transfer Size: ${Math.round(this.results.desktop.thirdPartyImpact.totalBytes / 1024)}KB`);
      
      console.log('\n  TOP THIRD-PARTY RESOURCES:');
      this.results.desktop.thirdPartyImpact.items
        .sort((a, b) => b.blockingTime - a.blockingTime)
        .slice(0, 3)
        .forEach(item => {
          console.log(`  • ${item.name}: ${item.blockingTime.toFixed(0)}ms blocking, ${Math.round(item.transferSize / 1024)}KB`);
        });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`\n📁 Reports saved to: ${this.config.outputPath}/`);
    console.log(`   • production-baseline.json - Raw data`);
    console.log(`   • Individual HTML reports for each device`);
    
    // Check if local comparison exists
    const localComparisonPath = path.join(this.config.outputPath, 'local-vs-production.json');
    if (fs.existsSync(localComparisonPath)) {
      console.log(`   • local-vs-production.json - Comparison with local baseline`);
    }
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

