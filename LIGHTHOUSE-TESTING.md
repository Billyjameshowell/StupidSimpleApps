# Lighthouse Testing Guide

This repository includes tools for running Lighthouse performance tests on both local development builds and the production site.

## Available Scripts

- `npm run lighthouse` - Run Lighthouse tests on the local development build
- `npm run lighthouse:prod` - Run Lighthouse tests on the production site (stupid-simple-apps.com)
- `npm run lighthouse:quick` - Run a quick Lighthouse test on the local development server
- `npm run lighthouse:trends` - Generate trend charts from historical Lighthouse data

## Running Baseline Tests

To establish baseline performance scores:

1. Build the project:
   ```
   npm run build
   ```

2. Run the Lighthouse tests:
   ```
   npm run lighthouse
   ```

3. To test the production site:
   ```
   npm run lighthouse:prod
   ```

## Generated Reports

The tests generate several reports in the `lighthouse-reports` directory:

- `lighthouse-baseline.json` - Raw data from local tests
- `lighthouse-baseline.html` - HTML report from local tests
- `production-baseline.json` - Raw data from production tests
- `local-vs-production.json` - Comparison between local and production
- `comparison-report.html` - Visual comparison of all metrics
- Individual HTML reports for each device and test run

## Tracking Performance Over Time

The tests automatically track performance history in `lighthouse-history.json`. To view trends:

```
npm run lighthouse:trends
```

This generates a `trends.html` file with charts showing performance trends over time.

## Core Web Vitals

The reports include detailed metrics for Core Web Vitals:

- **LCP (Largest Contentful Paint)** - Measures loading performance
- **FID/TBT (First Input Delay/Total Blocking Time)** - Measures interactivity
- **CLS (Cumulative Layout Shift)** - Measures visual stability

## Comparing Local vs Production

When running both local and production tests, a comparison report is generated that shows:

- Score differences between environments
- Impact of analytics and third-party scripts
- Potential optimization opportunities

## Troubleshooting

If Chrome is not available, the tests will report "Lighthouse skipped - Chrome not found" but will continue with other tasks.

For best results, run tests on a stable network connection and with minimal background processes running.

