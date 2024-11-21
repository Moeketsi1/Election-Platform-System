// Pie Chart Configuration
export const pieConfig = {
  type: 'pie',
  data: null,
  options: {
    responsive: true,
    maintainAspectRati: false,
    plugins: {
      legend: {
        position: 'top',
        display: true
      },
      title: {
        display: true,
        text: 'Total Votes Distribution'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} votes`;
          }
        }
      }
    }
  }
};

// Line Chart Configuration
export const lineConfig = {
  type: 'line',
  data: null,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Voting Trends Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Votes'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  }
};

