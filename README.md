# SEO Performance Audit Tools

This repository contains a set of tools for conducting a comprehensive SEO and performance audit for Stupid Simple Apps.

## Overview

The audit tools analyze various aspects of website performance including:

- Bundle size analysis
- Dependency audit
- Image optimization
- Code quality
- Lighthouse metrics
- Real-user performance monitoring

## Reports Generated

The master report generator combines all individual audit results into comprehensive reports:

- `master-report.json` - Complete audit data in JSON format
- `master-report.html` - Visual HTML report with metrics, issues, and recommendations
- `master-report-summary.md` - Markdown summary with key findings

## Running the Audit

To generate the comprehensive report:

```bash
node scripts/generate-master-report.js
```

This will:
1. Run all individual audit scripts
2. Collect and analyze the results
3. Generate recommendations and an action plan
4. Create the output reports

## Individual Audit Scripts

- `scripts/analyze-bundle.js` - Analyzes JavaScript bundle sizes
- `scripts/audit-dependencies.js` - Checks for unused and heavy dependencies
- `scripts/audit-images.js` - Identifies image optimization opportunities
- `scripts/analyze-code-quality.js` - Finds code quality issues

## Report Structure

The master report includes:

- Overall performance score and grade (A-F)
- Critical issues and warnings
- Detailed metrics across all audit categories
- Prioritized recommendations
- 4-week action plan for implementing fixes

