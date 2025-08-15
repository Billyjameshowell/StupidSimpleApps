const fs = require('fs');
const path = require('path');

class LighthouseTrends {
  constructor() {
    this.historyFile = 'lighthouse-history.json';
    this.outputPath = 'lighthouse-reports';
  }

  analyze() {
    if (!fs.existsSync(this.historyFile)) {
      console.log('No history file found. Run lighthouse tests first.');
      return;
    }

    const history = JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
    
    if (history.length === 0) {
      console.log('No historical data available.');
      return;
    }

    console.log('📈 Lighthouse Score Trends\n');
    console.log('='.repeat(60));

    // Calculate averages and trends
    const latest = history[history.length - 1];
    const previous = history.length > 1 ? history[history.length - 2] : null;

    // Display latest scores
    console.log('\n📊 Latest Scores:', new Date(latest.timestamp).toLocaleDateString());
    console.log('-'.repeat(40));
    
    ['desktop', 'mobile'].forEach(device => {
      console.log(`\n${device.toUpperCase()}:`);
      Object.entries(latest[device]).forEach(([metric, score]) => {
        if (score !== null) {
          let trend = '';
          if (previous && previous[device][metric] !== undefined) {
            const diff = score - previous[device][metric];
            if (diff > 0) trend = `📈 +${diff}`;
            else if (diff < 0) trend = `📉 ${diff}`;
            else trend = '→ 0';
          }
          
          const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
          console.log(`  ${emoji} ${metric}: ${score} ${trend}`);
        }
      });
    });

    // Calculate 30-day average
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentHistory = history.filter(entry => 
      new Date(entry.timestamp) >= thirtyDaysAgo
    );

    if (recentHistory.length > 1) {
      console.log('\n📊 30-Day Averages:');
      console.log('-'.repeat(40));
      
      ['desktop', 'mobile'].forEach(device => {
        console.log(`\n${device.toUpperCase()}:`);
        
        const averages = {};
        Object.keys(recentHistory[0][device]).forEach(metric => {
          if (recentHistory[0][device][metric] !== null) {
            const scores = recentHistory.map(h => h[device][metric]).filter(s => s !== null);
            averages[metric] = Math.round(scores.reduce((a, b) => a + b) / scores.length);
          }
        });
        
        Object.entries(averages).forEach(([metric, avg]) => {
          console.log(`  ${metric}: ${avg}`);
        });
      });
    }

    // Generate trend chart
    this.generateTrendChart(history);
  }

  generateTrendChart(history) {
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Lighthouse Score Trends</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .chart-container {
      position: relative;
      height: 400px;
      margin-bottom: 40px;
    }
    h1 {
      text-align: center;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📈 Lighthouse Score Trends</h1>
    
    <h2>Desktop Performance</h2>
    <div class="chart-container">
      <canvas id="desktopChart"></canvas>
    </div>
    
    <h2>Mobile Performance</h2>
    <div class="chart-container">
      <canvas id="mobileChart"></canvas>
    </div>
    
    <script>
      // Parse the history data
      const historyData = ${JSON.stringify(history)};
      
      // Prepare data for charts
      const labels = historyData.map(entry => {
        const date = new Date(entry.timestamp);
        return date.toLocaleDateString();
      });
      
      // Desktop data
      const desktopData = {
        performance: historyData.map(entry => entry.desktop.performance),
        accessibility: historyData.map(entry => entry.desktop.accessibility),
        bestPractices: historyData.map(entry => entry.desktop.bestPractices),
        seo: historyData.map(entry => entry.desktop.seo)
      };
      
      // Mobile data
      const mobileData = {
        performance: historyData.map(entry => entry.mobile.performance),
        accessibility: historyData.map(entry => entry.mobile.accessibility),
        bestPractices: historyData.map(entry => entry.mobile.bestPractices),
        seo: historyData.map(entry => entry.mobile.seo)
      };
      
      // Create desktop chart
      const desktopCtx = document.getElementById('desktopChart').getContext('2d');
      new Chart(desktopCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Performance',
              data: desktopData.performance,
              borderColor: '#FF6384',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              tension: 0.1
            },
            {
              label: 'Accessibility',
              data: desktopData.accessibility,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              tension: 0.1
            },
            {
              label: 'Best Practices',
              data: desktopData.bestPractices,
              borderColor: '#FFCE56',
              backgroundColor: 'rgba(255, 206, 86, 0.1)',
              tension: 0.1
            },
            {
              label: 'SEO',
              data: desktopData.seo,
              borderColor: '#4BC0C0',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '/100';
                }
              }
            }
          }
        }
      });
      
      // Create mobile chart
      const mobileCtx = document.getElementById('mobileChart').getContext('2d');
      new Chart(mobileCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Performance',
              data: mobileData.performance,
              borderColor: '#FF6384',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              tension: 0.1
            },
            {
              label: 'Accessibility',
              data: mobileData.accessibility,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              tension: 0.1
            },
            {
              label: 'Best Practices',
              data: mobileData.bestPractices,
              borderColor: '#FFCE56',
              backgroundColor: 'rgba(255, 206, 86, 0.1)',
              tension: 0.1
            },
            {
              label: 'SEO',
              data: mobileData.seo,
              borderColor: '#4BC0C0',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '/100';
                }
              }
            }
          }
        }
      });
    </script>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(
      path.join(this.outputPath, 'trends.html'),
      html
    );
    
    console.log(`\n📊 Trend chart generated: ${this.outputPath}/trends.html`);
  }
}

// Run analysis
const analyzer = new LighthouseTrends();
analyzer.analyze();

