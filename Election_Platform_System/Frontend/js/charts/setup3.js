// Initial voting data
export const votingData = {
  candidates: {
    greenFuture: {
      name: "A Greener Future for ALL",
      votes: 0,
      color: 'rgb(34, 139, 34)' // Green
    },
    localEconomies: {
      name: "Building Stronger local Economies",
      votes: 0,
      color: 'rgb(54, 162, 235)' // Blue
    }
  },
  // Track votes over time for the line chart
  timeSeriesData: {
    labels: [],
    greenFutureVotes: [],
    localEconomiesVotes: []
  }
};

// Helper function to get current timestamp
const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

// Function to update charts data
export const updateChartsData = () => {
  const { candidates, timeSeriesData } = votingData;
  
  // Update time series data
  timeSeriesData.labels.push(getCurrentTime());
  timeSeriesData.greenFutureVotes.push(candidates.greenFuture.votes);
  timeSeriesData.localEconomiesVotes.push(candidates.localEconomies.votes);

  // Limit the number of points shown on line chart
  const maxPoints = 10;
  if (timeSeriesData.labels.length > maxPoints) {
    timeSeriesData.labels = timeSeriesData.labels.slice(-maxPoints);
    timeSeriesData.greenFutureVotes = timeSeriesData.greenFutureVotes.slice(-maxPoints);
    timeSeriesData.localEconomiesVotes = timeSeriesData.localEconomiesVotes.slice(-maxPoints);
  }

  // Create data for both charts
  return {
    pieData: {
      labels: [candidates.greenFuture.name, candidates.localEconomies.name],
      datasets: [{
        data: [
          candidates.greenFuture.votes,
          candidates.localEconomies.votes
        ],
        backgroundColor: [
          candidates.greenFuture.color,
          candidates.localEconomies.color
        ]
      }]
    },
    
    lineData: {
      labels: timeSeriesData.labels,
      datasets: [
        {
          label: candidates.greenFuture.name,
          data: timeSeriesData.greenFutureVotes,
          borderColor: candidates.greenFuture.color,
          fill: false
        },
        {
          label: candidates.localEconomies.name,
          data: timeSeriesData.localEconomiesVotes,
          borderColor: candidates.localEconomies.color,
          fill: false
        }
      ]
    }
  };
};