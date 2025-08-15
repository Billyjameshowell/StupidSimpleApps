# Lighthouse Testing Guide

This guide explains how to run Lighthouse and WebPageTest performance tests on the StupidSimpleApps website to measure improvements after implementing fixes.

## Prerequisites

Before running the tests, make sure you have the following:

1. Node.js installed (v14 or later)
2. The project dependencies installed (`npm install`)
3. Local development server running (for local tests)

## Available Scripts

The following scripts are available for performance testing:

### Lighthouse Tests

1. **Full Lighthouse Test (Local + Production)**
   ```
   npm run lighthouse
   ```
   This script runs Lighthouse on both the local development server and the production site, then generates a comparison report.

2. **Production-Only Lighthouse Test**
   ```
   npm run lighthouse:prod
   ```
   This script runs Lighthouse only on the production site and generates a comparison report.

3. **Quick Lighthouse Test**
   ```
   npm run lighthouse:quick
   ```
   This script runs a quick Lighthouse test on the production site, focusing only on performance metrics.

4. **Lighthouse Trends**
   ```
   npm run lighthouse:trends
   ```
   This script runs Lighthouse on the production site and updates a trends file to track performance over time.

### WebPageTest

1. **WebPageTest**
   ```
   npm run webpagetest
   ```
   This script runs WebPageTest on both the local development server and the production site, then generates a comparison report.

   **Note:** WebPageTest requires an API key. Set it as an environment variable:
   ```
   WPT_API_KEY=your_api_key npm run webpagetest
   ```

## Output Files

The scripts generate the following output files:

### Lighthouse Reports

- `lighthouse-reports/lighthouse-final.json`: JSON report for the production site
- `lighthouse-reports/lighthouse-final.html`: HTML report for the production site
- `lighthouse-reports/lighthouse-final-local.json`: JSON report for the local development server
- `lighthouse-reports/lighthouse-final-local.html`: HTML report for the local development server
- `lighthouse-reports/lighthouse-comparison.json`: Comparison report showing before/after scores

### WebPageTest Reports

- `webpagetest-reports/webpagetest-final.json`: Full JSON report for the production site
- `webpagetest-reports/webpagetest-final-metrics.json`: Metrics summary for the production site
- `webpagetest-reports/webpagetest-final-local.json`: Full JSON report for the local development server
- `webpagetest-reports/webpagetest-final-local-metrics.json`: Metrics summary for the local development server
- `webpagetest-reports/webpagetest-comparison.json`: Comparison report showing before/after scores

## Interpreting Results

The comparison reports (`lighthouse-comparison.json` and `webpagetest-comparison.json`) show the following:

1. **Baseline Scores**: The performance scores before implementing fixes
2. **Current Scores**: The performance scores after implementing fixes
3. **Improvement**: The difference between baseline and current scores, shown as both absolute points and percentage
4. **Core Web Vitals**: Key metrics that affect user experience and SEO ranking
5. **Gaps**: Factors that may cause differences between local and production performance

## Core Web Vitals

The tests measure the following Core Web Vitals:

1. **Largest Contentful Paint (LCP)**: Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.

2. **First Input Delay (FID)**: Measures interactivity. To provide a good user experience, pages should have a FID of 100 milliseconds or less.

3. **Cumulative Layout Shift (CLS)**: Measures visual stability. To provide a good user experience, pages should maintain a CLS of 0.1 or less.

## Troubleshooting

If you encounter issues running the tests:

1. **Local Tests Failing**: Make sure your local development server is running on the correct port (default: 3000).

2. **WebPageTest API Key**: If you're getting API errors with WebPageTest, check that you've provided a valid API key.

3. **Chrome Installation**: Lighthouse requires Chrome to be installed on your system. If you're running in a CI environment, you may need to install Chrome or use a headless browser.

4. **Timeout Errors**: If tests are timing out, try increasing the timeout in the script or running the tests on a more powerful machine.

## Continuous Monitoring

For ongoing performance monitoring, consider setting up a scheduled job to run the `lighthouse:trends` script regularly. This will help you track performance over time and identify regressions.

