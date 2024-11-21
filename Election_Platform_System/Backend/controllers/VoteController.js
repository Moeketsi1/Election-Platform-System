export class VoteController {
    #votingSystem;
    #chartController;

    constructor(votingSystem, chartController) {
        this.#votingSystem = votingSystem;
        this.#chartController = chartController;
    }


    // new co-pilot
    handleVote(candidateId) {
    if (sessionStorage.getItem('hasVoted')) {
        alert('You have already voted!');
        return;
    }

    const userId = sessionStorage.getItem('userId');
    const province = sessionStorage.getItem('province'); // Assuming province is stored on login
    
    fetch('/cast-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, candidate_id: candidateId, province })
    })
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem('hasVoted', 'true');
        this.disableVoteButtons();
        alert('Thank you for voting!');
    })
    .catch(err => console.error('Vote failed:', err));
}













