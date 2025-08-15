const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MasterReportGenerator {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.reports = {
      bundle: null,
      dependencies: null,
      images: null,
      codeQuality: null,
      lighthouse: null,
      performance: null
    };
    
    this.masterReport = {
      timestamp: this.timestamp,
      summary: {
        score: 0,
        grade: '',
        criticalIssues: 0,
        warnings: 0,
        passedChecks: 0
      },
      metrics: {},
      issues: [],
      recommendations: [],
      actionPlan: []
    };
  }

  async generate() {
    console.log('🎯 Generating Master Performance Report...\n');
    
    // Run all audits
    await this.runAllAudits();
    
    // Load all reports
    this.loadReports();
    
    // Analyze results
    this.analyzeResults();
    
    // Generate recommendations
    this.generateRecommendations();
    
    // Create action plan
    this.createActionPlan();
    
    // Calculate overall score
    this.calculateScore();
    
    // Generate outputs
    this.generateOutputs();
    
    console.log('\n✅ Master report generation complete!');
  }

  async runAllAudits() {
    console.log('🔄 Running all audits...\n');
    
    const audits = [
      { name: 'Bundle Analysis', script: 'node scripts/analyze-bundle.js' },
      { name: 'Dependency Audit', script: 'node scripts/audit-dependencies.js' },
      { name: 'Image Audit', script: 'node scripts/audit-images.js' },
      { name: 'Code Quality', script: 'node scripts/analyze-code-quality.js' }
    ];
    
    for (const audit of audits) {
      console.log(`  Running ${audit.name}...`);
      try {
        execSync(audit.script, { stdio: 'pipe' });
        console.log(`  ✅ ${audit.name} completed`);
      } catch (error) {
        console.log(`  ⚠️ ${audit.name} failed - continuing...`);
      }
    }
    
    console.log();
  }

  loadReports() {
    console.log('📁 Loading audit reports...');
    
    const reportFiles = {
      bundle: 'bundle-analysis-report.json',
      dependencies: 'dependency-audit-report.json',
      images: 'image-audit-report.json',
      codeQuality: 'code-quality-report.json',
      lighthouse: 'lighthouse-report.json',
      performance: 'performance-monitoring-report.json'
    };
    
    Object.entries(reportFiles).forEach(([key, file]) => {
      if (fs.existsSync(file)) {
        this.reports[key] = JSON.parse(fs.readFileSync(file, 'utf8'));
        console.log(`  ✅ Loaded ${key} report`);
      } else {
        console.log(`  ⚠️ ${key} report not found`);
      }
    });
    
    console.log();
  }

  analyzeResults() {
    console.log('🔍 Analyzing results...');
    
    // Bundle metrics
    if (this.reports.bundle) {
      this.masterReport.metrics.bundle = {
        totalSize: this.reports.bundle.totalSize,
        bundles: this.reports.bundle.bundles,
        recommendations: this.reports.bundle.recommendations
      };
      
      // Check for issues
      this.reports.bundle.recommendations.forEach(rec => {
        this.addIssue(
          rec.type === 'critical' ? 'critical' : 'warning',
          'Bundle Size',
          rec.message
        );
      });
    }
    
    // Dependency metrics
    if (this.reports.dependencies) {
      const deps = this.reports.dependencies;
      this.masterReport.metrics.dependencies = {
        total: deps.totalDependencies,
        unused: deps.unused.dependencies.length + deps.unused.devDependencies.length,
        heavy: deps.heavy.length,
        duplicates: deps.duplicates.length
      };
      
      if (deps.unused.dependencies.length > 0) {
        this.addIssue(
          'warning',
          'Dependencies',
          `${deps.unused.dependencies.length} unused dependencies found`
        );
      }
      
      if (deps.heavy.length > 0) {
        this.addIssue(
          'warning',
          'Dependencies',
          `${deps.heavy.length} heavy packages that could be optimized`
        );
      }
    }
    
    // Image metrics
    if (this.reports.images) {
      const images = this.reports.images;
      this.masterReport.metrics.images = {
        total: images.totalImages,
        totalSize: images.totalSize,
        largeImages: images.issues.large.length,
        unoptimized: images.issues.unoptimized.length
      };
      
      if (images.issues.large.length > 0) {
        this.addIssue(
          images.totalSize > 10 * 1024 * 1024 ? 'critical' : 'warning',
          'Images',
          `${images.issues.large.length} large images need optimization`
        );
      }
    }
    
    // Code quality metrics
    if (this.reports.codeQuality) {
      const quality = this.reports.codeQuality;
      let totalIssues = 0;
      
      Object.entries(quality.issues).forEach(([category, issues]) => {
        if (issues.length > 0) {
          totalIssues += issues.length;
          
          const severity = category === 'hooks' ? 'critical' : 
                          category === 'console' ? 'warning' : 'info';
          
          this.addIssue(
            severity,
            'Code Quality',
            `${issues.length} ${category} issues found`
          );
        }
      });
      
      this.masterReport.metrics.codeQuality = {
        filesAnalyzed: quality.totalFiles,
        totalIssues
      };
    }
    
    // Lighthouse metrics
    if (this.reports.lighthouse) {
      const lighthouse = this.reports.lighthouse;
      
      this.masterReport.metrics.lighthouse = {
        desktop: lighthouse.desktop?.scores,
        mobile: lighthouse.mobile?.scores
      };
      
      // Check for low scores
      ['desktop', 'mobile'].forEach(device => {
        const scores = lighthouse[device]?.scores;
        if (scores) {
          Object.entries(scores).forEach(([metric, score]) => {
            if (score !== null && score < 90) {
              this.addIssue(
                score < 50 ? 'critical' : 'warning',
                'Lighthouse',
                `${device} ${metric} score is ${score}/100`
              );
            }
          });
        }
      });
    }
  }

  addIssue(severity, category, message) {
    this.masterReport.issues.push({
      severity,
      category,
      message
    });
    
    if (severity === 'critical') {
      this.masterReport.summary.criticalIssues++;
    } else if (severity === 'warning') {
      this.masterReport.summary.warnings++;
    }
  }

  generateRecommendations() {
    console.log('💡 Generating recommendations...');
    
    const recommendations = [];
    
    // Critical recommendations
    if (this.masterReport.summary.criticalIssues > 0) {
      recommendations.push({
        priority: 1,
        category: 'Critical',
        title: 'Fix Critical Issues',
        description: 'Address critical performance issues immediately',
        impact: 'High',
        effort: 'Varies',
        items: this.masterReport.issues
          .filter(i => i.severity === 'critical')
          .map(i => i.message)
      });
    }
    
    // Bundle optimization
    if (this.reports.bundle?.totalSize > 500 * 1024) {
      recommendations.push({
        priority: 2,
        category: 'Bundle Size',
        title: 'Implement Code Splitting',
        description: 'Split large bundles to improve initial load time',
        impact: 'High',
        effort: 'Medium',
        items: [
          'Implement route-based code splitting',
          'Lazy load heavy components',
          'Extract vendor bundles'
        ]
      });
    }
    
    // Image optimization
    if (this.reports.images?.issues.large.length > 5) {
      recommendations.push({
        priority: 3,
        category: 'Images',
        title: 'Optimize Images',
        description: 'Compress and convert images to modern formats',
        impact: 'High',
        effort: 'Low',
        items: [
          'Convert images to WebP format',
          'Implement responsive images',
          'Add lazy loading for below-fold images'
        ]
      });
    }
    
    // Dependency optimization
    if (this.reports.dependencies?.unused.dependencies.length > 0) {
      recommendations.push({
        priority: 4,
        category: 'Dependencies',
        title: 'Clean Up Dependencies',
        description: 'Remove unused packages to reduce bundle size',
        impact: 'Medium',
        effort: 'Low',
        items: [
          `Remove ${this.reports.dependencies.unused.dependencies.length} unused dependencies`,
          'Replace heavy packages with lighter alternatives',
          'Audit and update outdated packages'
        ]
      });
    }
    
    // Code quality
    if (this.reports.codeQuality) {
      const issues = this.reports.codeQuality.issues;
      if (issues.console.length > 0 || issues.memoization.length > 0) {
        recommendations.push({
          priority: 5,
          category: 'Code Quality',
          title: 'Improve React Performance',
          description: 'Optimize React components and hooks usage',
          impact: 'Medium',
          effort: 'Medium',
          items: [
            'Remove console statements',
            'Add memoization to expensive operations',
            'Implement useCallback for event handlers',
            'Fix React hooks violations'
          ]
        });
      }
    }
    
    this.masterReport.recommendations = recommendations;
  }

  createActionPlan() {
    console.log('📋 Creating action plan...');
    
    const actionPlan = [];
    
    // Week 1: Critical fixes
    actionPlan.push({
      phase: 'Week 1: Critical Fixes',
      tasks: [
        'Fix all critical Lighthouse issues',
        'Remove console.log statements',
        'Fix React hooks violations',
        'Remove unused dependencies'
      ],
      expectedImpact: '10-20% performance improvement'
    });
    
    // Week 2: Optimization
    actionPlan.push({
      phase: 'Week 2: Optimization',
      tasks: [
        'Implement code splitting',
        'Optimize and compress images',
        'Convert images to WebP',
        'Add lazy loading'
      ],
      expectedImpact: '20-30% load time reduction'
    });
    
    // Week 3: Advanced optimization
    actionPlan.push({
      phase: 'Week 3: Advanced Optimization',
      tasks: [
        'Implement React.memo and useMemo',
        'Optimize bundle configuration',
        'Set up CDN for static assets',
        'Implement service worker caching'
      ],
      expectedImpact: '15-25% additional improvement'
    });
    
    // Week 4: Monitoring
    actionPlan.push({
      phase: 'Week 4: Monitoring & Maintenance',
      tasks: [
        'Set up continuous monitoring',
        'Configure performance budgets',
        'Add automated testing',
        'Document performance guidelines'
      ],
      expectedImpact: 'Prevent future regressions'
    });
    
    this.masterReport.actionPlan = actionPlan;
  }

  calculateScore() {
    console.log('📊 Calculating overall score...');
    
    let score = 100;
    
    // Deduct points for issues
    score -= this.masterReport.summary.criticalIssues * 15;
    score -= this.masterReport.summary.warnings * 5;
    
    // Factor in Lighthouse scores if available
    if (this.reports.lighthouse) {
      const desktopPerf = this.reports.lighthouse.desktop?.scores?.performance || 100;
      const mobilePerf = this.reports.lighthouse.mobile?.scores?.performance || 100;
      const avgLighthouse = (desktopPerf + mobilePerf) / 2;
      
      score = (score + avgLighthouse) / 2;
    }
    
    score = Math.max(0, Math.min(100, Math.round(score)));
    
    this.masterReport.summary.score = score;
    this.masterReport.summary.grade = 
      score >= 90 ? 'A' :
      score >= 80 ? 'B' :
      score >= 70 ? 'C' :
      score >= 60 ? 'D' : 'F';
    
    this.masterReport.summary.passedChecks = 
      Object.values(this.reports).filter(r => r !== null).length;
  }

  generateOutputs() {
    console.log('\n📄 Generating output files...');
    
    // Save JSON report
    fs.writeFileSync('master-report.json', 
      JSON.stringify(this.masterReport, null, 2));
    console.log('  ✅ JSON report saved');
    
    // Generate HTML report
    this.generateHTMLReport();
    console.log('  ✅ HTML report saved');
    
    // Generate Markdown summary
    this.generateMarkdownSummary();
    console.log('  ✅ Markdown summary saved');
    
    // Display summary
    this.displaySummary();
  }

  generateHTMLReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Performance Audit Report - ${new Date().toLocaleDateString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .score-circle {
      width: 150px;
      height: 150px;
      margin: 30px auto;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3em;
      font-weight: bold;
      background: white;
      color: #333;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .grade-A { color: #4caf50; }
    .grade-B { color: #8bc34a; }
    .grade-C { color: #ffc107; }
    .grade-D { color: #ff9800; }
    .grade-F { color: #f44336; }
    .content {
      padding: 40px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      background: #f8f9fa;
    }
    .summary-value {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .summary-label {
      color: #666;
      font-size: 0.9em;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      color: #667eea;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #eee;
    }
    .issues {
      list-style: none;
    }
    .issue {
      padding: 15px;
      margin-bottom: 10px;
      border-left: 4px solid;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .issue-critical {
      border-color: #f44336;
      background: #ffebee;
    }
    .issue-warning {
      border-color: #ff9800;
      background: #fff3e0;
    }
    .issue-info {
      border-color: #2196f3;
      background: #e3f2fd;
    }
    .recommendation {
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      background: #f8f9fa;
    }
    .recommendation h3 {
      color: #667eea;
      margin-bottom: 10px;
    }
    .recommendation-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
      font-size: 0.9em;
      color: #666;
    }
    .action-plan {
      margin-bottom: 20px;
      padding: 20px;
      background: #e8f5e9;
      border-radius: 8px;
    }
    .action-plan h3 {
      color: #4caf50;
      margin-bottom: 10px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .metric-card {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .metric-card h4 {
      color: #667eea;
      margin-bottom: 15px;
    }
    .metric-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
    .metric-item:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Performance Audit Report</h1>
      <p>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      <div class="score-circle grade-${this.masterReport.summary.grade}">
        ${this.masterReport.summary.score}
      </div>
      <h2>Grade: ${this.masterReport.summary.grade}</h2>
    </div>
    
    <div class="content">
      <div class="summary">
        <div class="summary-card">
          <div class="summary-value">${this.masterReport.summary.criticalIssues}</div>
          <div class="summary-label">Critical Issues</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">${this.masterReport.summary.warnings}</div>
          <div class="summary-label">Warnings</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">${this.masterReport.summary.passedChecks}</div>
          <div class="summary-label">Audits Completed</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">${this.masterReport.recommendations.length}</div>
          <div class="summary-label">Recommendations</div>
        </div>
      </div>
      
      ${this.masterReport.issues.length > 0 ? `
        <div class="section">
          <h2>🔍 Issues Found</h2>
          <ul class="issues">
            ${this.masterReport.issues.map(issue => `
              <li class="issue issue-${issue.severity}">
                <strong>${issue.category}:</strong> ${issue.message}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div class="section">
        <h2>📊 Metrics</h2>
        <div class="metrics-grid">
          ${Object.entries(this.masterReport.metrics).map(([category, metrics]) => `
            <div class="metric-card">
              <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              ${Object.entries(metrics).map(([key, value]) => `
                <div class="metric-item">
                  <span>${key}:</span>
                  <strong>${typeof value === 'object' ? JSON.stringify(value) : value}</strong>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="section">
        <h2>💡 Recommendations</h2>
        ${this.masterReport.recommendations.map(rec => `
          <div class="recommendation">
            <h3>${rec.title}</h3>
            <div class="recommendation-meta">
              <span>📊 Impact: ${rec.impact}</span>
              <span>💪 Effort: ${rec.effort}</span>
              <span>🎯 Priority: ${rec.priority}</span>
            </div>
            <p>${rec.description}</p>
            ${rec.items ? `
              <ul style="margin-top: 10px; margin-left: 20px;">
                ${rec.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <h2>📅 Action Plan</h2>
        ${this.masterReport.actionPlan.map(phase => `
          <div class="action-plan">
            <h3>${phase.phase}</h3>
            <ul style="margin: 10px 0 10px 20px;">
              ${phase.tasks.map(task => `<li>${task}</li>`).join('')}
            </ul>
            <p><strong>Expected Impact:</strong> ${phase.expectedImpact}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;
    
    fs.writeFileSync('master-report.html', html);
  }

  generateMarkdownSummary() {
    const md = `# 🚀 Performance Audit Summary

**Date:** ${new Date().toLocaleDateString()}
**Overall Score:** ${this.masterReport.summary.score}/100
**Grade:** ${this.masterReport.summary.grade}

## 📊 Key Metrics

- **Critical Issues:** ${this.masterReport.summary.criticalIssues}
- **Warnings:** ${this.masterReport.summary.warnings}
- **Audits Completed:** ${this.masterReport.summary.passedChecks}

## 🔍 Top Issues

${this.masterReport.issues
  .filter(i => i.severity === 'critical')
  .map(i => `- ❌ **${i.category}:** ${i.message}`)
  .join('\n')}

${this.masterReport.issues
  .filter(i => i.severity === 'warning')
  .slice(0, 5)
  .map(i => `- ⚠️ **${i.category}:** ${i.message}`)
  .join('\n')}

## 💡 Top Recommendations

${this.masterReport.recommendations
  .slice(0, 3)
  .map(r => `### ${r.priority}. ${r.title}\n**Impact:** ${r.impact} | **Effort:** ${r.effort}\n\n${r.description}`)
  .join('\n\n')}

## 📅 4-Week Action Plan

${this.masterReport.actionPlan
  .map(p => `### ${p.phase}\n${p.tasks.map(t => `- ${t}`).join('\n')}\n\n**Expected Impact:** ${p.expectedImpact}`)
  .join('\n\n')}

---

For full details, see the complete HTML report.
`;
    
    fs.writeFileSync('master-report-summary.md', md);
  }

  displaySummary() {
    console.log('\n📋 REPORT SUMMARY');
    console.log('=================');
    console.log(`Overall Score: ${this.masterReport.summary.score}/100 (Grade ${this.masterReport.summary.grade})`);
    console.log(`Critical Issues: ${this.masterReport.summary.criticalIssues}`);
    console.log(`Warnings: ${this.masterReport.summary.warnings}`);
    console.log(`Audits Completed: ${this.masterReport.summary.passedChecks}`);
    console.log(`Recommendations: ${this.masterReport.recommendations.length}`);
    console.log('\nOutput files:');
    console.log('  - master-report.json');
    console.log('  - master-report.html');
    console.log('  - master-report-summary.md');
  }
}

// Run the report generator
const generator = new MasterReportGenerator();
generator.generate().catch(console.error);

