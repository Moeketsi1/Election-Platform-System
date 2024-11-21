import { Candidate } from './Candidate.js';

export class VotingSystem {
    #candidates;
    #timeSeriesData;

    constructor() {
        this.#candidates = {
            greenFuture: new Candidate("A Greener Future for ALL", 'rgb(34, 139, 34)'),
            localEconomies: new Candidate("Building Stronger local Economies", 'rgb(54, 162, 235)')
        };
        
        this.#timeSeriesData = {
            labels: [],
            greenFutureVotes: [],
            localEconomiesVotes: []
        };
    }

    getCurrentTime() {
        const now = new Date();
        return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    castVote(candidateId) {
        const candidate = candidateId === 1 ? 'greenFuture' : 'localEconomies';
        this.#candidates[candidate].incrementVote();
        this.updateTimeSeriesData();
        return this.getChartsData();
    }

    updateTimeSeriesData() {
        this.#timeSeriesData.labels.push(this.getCurrentTime());
        this.#timeSeriesData.greenFutureVotes.push(this.#candidates.greenFuture.votes);
        this.#timeSeriesData.localEconomiesVotes.push(this.#candidates.localEconomies.votes);

        const maxPoints = 10;
        if (this.#timeSeriesData.labels.length > maxPoints) {
            this.#timeSeriesData.labels = this.#timeSeriesData.labels.slice(-maxPoints);
            this.#timeSeriesData.greenFutureVotes = this.#timeSeriesData.greenFutureVotes.slice(-maxPoints);
            this.#timeSeriesData.localEconomiesVotes = this.#timeSeriesData.localEconomiesVotes.slice(-maxPoints);
        }
    }

    getChartsData() {
        return {
            pieData: this.getPieChartData(),
            lineData: this.getLineChartData()
        };
    }

    getPieChartData() {
        return {
            labels: [this.#candidates.greenFuture.name, this.#candidates.localEconomies.name],
            datasets: [{
                data: [
                    this.#candidates.greenFuture.votes,
                    this.#candidates.localEconomies.votes
                ],
                backgroundColor: [
                    this.#candidates.greenFuture.color,
                    this.#candidates.localEconomies.color
                ]
            }]
        };
    }

    getLineChartData() {
        return {
            labels: this.#timeSeriesData.labels,
            datasets: [
                {
                    label: this.#candidates.greenFuture.name,
                    data: this.#timeSeriesData.greenFutureVotes,
                    borderColor: this.#candidates.greenFuture.color,
                    fill: false
                },
                {
                    label: this.#candidates.localEconomies.name,
                    data: this.#timeSeriesData.localEconomiesVotes,
                    borderColor: this.#candidates.localEconomies.color,
                    fill: false
                }
            ]
        };
    }
}
