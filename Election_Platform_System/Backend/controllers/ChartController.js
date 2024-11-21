export class ChartController {
    #pieChart;
    #lineChart;
    #votingSystem;

    constructor(votingSystem) {
        this.#votingSystem = votingSystem;
    }

    initializeCharts() {
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        
        const initialData = this.#votingSystem.getChartsData();
        
        this.#pieChart = new Chart(pieCtx, {
            ...pieConfig,
            data: initialData.pieData
        });
        
        this.#lineChart = new Chart(lineCtx, {
            ...lineConfig,
            data: initialData.lineData
        });
    }

    updateCharts(newData) {
        // Update pie chart
        this.#pieChart.data.labels = newData.pieData.labels;
        this.#pieChart.data.datasets[0].data = newData.pieData.datasets[0].data;
        this.#pieChart.data.datasets[0].backgroundColor = newData.pieData.datasets[0].backgroundColor;
        
        // Update line chart
        this.#lineChart.data = newData.lineData;
        
        // Refresh both charts
        this.#pieChart.update();
        this.#lineChart.update();
    }
}