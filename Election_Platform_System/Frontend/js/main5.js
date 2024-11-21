import { auth, db } from './firebase-config.js';
import { FirestoreService } from './firestore-service.js';
import { pieConfig, lineConfig } from './charts/config3.js';
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let pieChart;
let lineChart;

document.addEventListener('DOMContentLoaded', async () => {
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const lineCtx = document.getElementById('lineChart').getContext('2d');

    pieChart = new Chart(pieCtx, {
        ...pieConfig,
        data: {
            labels: ['A Greener Future', 'Local Economies'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['rgb(34, 139, 34)', 'rgb(54, 162, 235)']
            }]
        }
    });

    lineChart = new Chart(lineCtx, {
        ...lineConfig,
        data: {
            labels: [],
            datasets: [
                {
                    label: 'A Greener Future',
                    data: [],
                    borderColor: 'rgb(34, 139, 34)',
                    fill: false
                },
                {
                    label: 'Local Economies',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    fill: false
                }
            ]
        }
    });

    // Listen for vote count updates
    FirestoreService.listenToVoteCounts((data) => {
        updateCharts(data);
    });

    // Check if user has already voted
    checkVoteStatus();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.vote-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const candidateId = parseInt(e.target.dataset.candidate);
            try {
                await castVote(candidateId);
            } catch (error) {
                console.error('Vote error:', error);
                alert(error.message);
            }
        });
    });
});



window.castVote = async function(candidateId) {
    try {
        const user = auth.currentUser;
        console.log("User in main5:", user);

        if (!user) {
            console.log("No user found");
            alert('Please log in to vote');
            window.location.href = '/login';
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        console.log("User doc:", userDocSnap.data());

        if (!userDocSnap.exists()) {
            throw new Error('User document not found');
        }

        const province = userDocSnap.data().province;
        await FirestoreService.castVote(candidateId, province);
        alert('Thank you for voting!');
        disableVoteButtons();
    } catch (error) {
        console.error('Error casting vote:', error);
        alert(error.message);
    }
};

function updateCharts(data) {
    const totalVotes = data.total_votes || 0;
    const candidate1Votes = data.candidate_1_votes || 0;
    const candidate2Votes = data.candidate_2_votes || 0;

    // Update pie chart
    pieChart.data.datasets[0].data = [candidate1Votes, candidate2Votes];
    pieChart.update();

    // Update line chart
    const timestamp = new Date().toLocaleTimeString();
    addDataPoint(lineChart, timestamp, [candidate1Votes, candidate2Votes]);
}

function addDataPoint(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset, i) => {
        dataset.data.push(data[i]);
    });

    // Keep only last 10 points
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(dataset => dataset.data.shift());
    }

    chart.update();
}

async function checkVoteStatus() {
    const user = auth.currentUser;
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().voted) {
            disableVoteButtons();
        }
    }
}

function disableVoteButtons() {
    document.querySelectorAll('.vote-button').forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    });
}