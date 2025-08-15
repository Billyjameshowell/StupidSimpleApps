# WebPageTest Performance Testing Guide

This guide explains how to use WebPageTest for more accurate performance testing of the StupidSimpleApps website.

## Why WebPageTest?

WebPageTest offers several advantages over Lighthouse:

1. **More accurate network simulation** - Uses packet-level throttling for realistic network conditions
2. **Multiple test runs** - Automatically runs multiple tests for more reliable results
3. **Detailed waterfall analysis** - Provides in-depth visualization of resource loading
4. **Repeat view testing** - Tests both first visit and repeat visits to measure caching effectiveness
5. **Global testing locations** - Tests from multiple geographic locations
6. **Film strip view** - Visual representation of page loading process
7. **Advanced metrics** - Provides additional metrics beyond Core Web Vitals

## Setup

1. Install dependencies:
   ```bash
   npm install --save-dev webpagetest
   ```

2. Get a WebPageTest API key:
   - Sign up at [WebPageTest.org](https://www.webpagetest.org/getkey.php)
   - Set your API key as an environment variable:
     ```bash
     export WEBPAGETEST_API_KEY=your_api_key_here
     ```

## Running Tests

Run the WebPageTest script:

```bash
npm run webpagetest
```

This will:
1. Build the project
2. Start a local server
3. Test the local environment
4. Test the production environment
5. Generate comparison reports

## Generated Reports

The tests generate several reports in the `webpagetest-reports` directory:

- `webpagetest-baseline.json` - Raw data from both environments
- `webpagetest-report.html` - Visual HTML report
- `local-test.json` - Detailed local test data
- `production-test.json` - Detailed production test data

## Understanding the Results

### Key Metrics

- **Load Time**: Time until the load event fires
- **TTFB (Time to First Byte)**: Time to receive the first byte of the response
- **First Contentful Paint**: Time when the first content appears
- **Largest Contentful Paint (LCP)**: Time when the largest content element appears
- **Speed Index**: Measure of how quickly content is visually displayed
- **Total Blocking Time (TBT)**: Sum of time when main thread is blocked
- **Cumulative Layout Shift (CLS)**: Measure of visual stability

### Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP    | < 2.5s | 2.5s - 4.0s | > 4.0s |
| TBT    | < 200ms | 200ms - 600ms | > 600ms |
| CLS    | < 0.1 | 0.1 - 0.25 | > 0.25 |

## Customizing Tests

You can customize the WebPageTest configuration in `scripts/webpagetest-runner.js`:

```javascript
this.config = {
  port: 3000,
  outputPath: 'webpagetest-reports',
  historyFile: 'webpagetest-history.json',
  apiKey: process.env.WEBPAGETEST_API_KEY || '',
  productionUrl: 'https://stupid-simple-apps.com',
  testOptions: {
    location: 'ec2-us-east-1:Chrome',
    connectivity: '4G',
    runs: 3,
    firstViewOnly: false,
    video: true,
    timeline: true,
    chromeTrace: true,
    netLog: true,
    disableOptimization: false,
    disableScreenshot: false,
    lighthouse: true
  }
};
```

## Troubleshooting

### API Key Issues

If you encounter API key issues:

1. Verify your API key is set correctly
2. Check your API usage limits
3. The script will fall back to mock data if API key issues occur

### Connection Issues

If you encounter connection issues:

1. Check your internet connection
2. Verify the local server is running
3. Ensure the production URL is accessible

## Additional Resources

- [WebPageTest Documentation](https://docs.webpagetest.org/)
- [WebPageTest API Reference](https://docs.webpagetest.org/api/reference/)
- [WebPageTest GitHub Repository](https://github.com/WPO-Foundation/webpagetest)
- [WebPageTest Node.js API Wrapper](https://github.com/marcelduran/webpagetest-api)

