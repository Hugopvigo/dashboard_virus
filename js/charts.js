/* charts.js — Chart.js trend line */

function initChart(data) {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;

  // Destroy previous instance if re-initialised
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: data.trend.labels,
      datasets: [
        {
          label: 'Confirmados',
          data: data.trend.confirmed,
          borderColor: '#ffaa00',
          backgroundColor: 'rgba(255,170,0,0.07)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#ffaa00',
          pointBorderColor: 'rgba(255,170,0,0.3)',
          pointBorderWidth: 3,
          borderWidth: 2
        },
        {
          label: 'Fallecidos',
          data: data.trend.deaths,
          borderColor: '#ff4444',
          backgroundColor: 'rgba(255,68,68,0.05)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#ff4444',
          pointBorderColor: 'rgba(255,68,68,0.3)',
          pointBorderWidth: 3,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: 'rgba(255,255,255,0.35)',
            font: { family: "'IBM Plex Mono', monospace", size: 10 },
            boxWidth: 10,
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8
          }
        },
        tooltip: {
          backgroundColor: '#181c22',
          borderColor: 'rgba(255,255,255,0.15)',
          borderWidth: 1,
          titleColor: 'rgba(255,255,255,0.85)',
          bodyColor: 'rgba(255,255,255,0.55)',
          titleFont: { family: "'IBM Plex Mono', monospace", size: 11, weight: '600' },
          bodyFont: { family: "'IBM Plex Mono', monospace", size: 11 },
          padding: 12,
          caretSize: 0,
          callbacks: {
            label: ctx => `  ${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: {
          border: { display: false },
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: 'rgba(255,255,255,0.28)',
            font: { family: "'IBM Plex Mono', monospace", size: 9 },
            maxRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: 'rgba(255,255,255,0.28)',
            font: { family: "'IBM Plex Mono', monospace", size: 9 },
            stepSize: 2
          }
        }
      }
    }
  });
}
