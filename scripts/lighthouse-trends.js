const fs = require('fs');
const path = require('path');

class LighthouseTrends {
  constructor() {
    this.historyFile = 'lighthouse-history.json';
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
      const history = ${JSON.stringify(history)};
      
      const labels = history.map(entry => {
        const date = new Date(entry.timestamp);
        return date.toLocaleDateString();
      });
      
      // Desktop chart
      const desktopCtx = document.getElementById('desktopChart').getContext('2d');
      new Chart(desktopCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Performance',
              data: history.map(entry => entry.desktop.performance),
              borderColor: '#0cce6b',
              backgroundColor: 'rgba(12, 206, 107, 0.1)',
              tension: 0.1
            },
            {
              label: 'Accessibility',
              data: history.map(entry => entry.desktop.accessibility),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.1
            },
            {
              label: 'Best Practices',
              data: history.map(entry => entry.desktop.bestPractices),
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.1
            },
            {
              label: 'SEO',
              data: history.map(entry => entry.desktop.seo),
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
              max: 100
            }
          }
        }
      });
      
      // Mobile chart
      const mobileCtx = document.getElementById('mobileChart').getContext('2d');
      new Chart(mobileCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Performance',
              data: history.map(entry => entry.mobile.performance),
              borderColor: '#0cce6b',
              backgroundColor: 'rgba(12, 206, 107, 0.1)',
              tension: 0.1
            },
            {
              label: 'Accessibility',
              data: history.map(entry => entry.mobile.accessibility),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.1
            },
            {
              label: 'Best Practices',
              data: history.map(entry => entry.mobile.bestPractices),
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.1
            },
            {
              label: 'SEO',
              data: history.map(entry => entry.mobile.seo),
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
              max: 100
            }
          }
        }
      });
    </script>
  </div>
</body>
</html>`;
    
    fs.writeFileSync('trends.html', html);
    console.log('\n✅ Trend chart generated: trends.html');
  }
}

// Run the analysis
const trends = new LighthouseTrends();
trends.analyze();

