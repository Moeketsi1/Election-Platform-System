export class Candidate {
    #name;
    #votes;
    #color;

    constructor(name, color) {
        this.#name = name;
        this.#votes = 0;
        this.#color = color;
    }

    get name() { return this.#name; }
    get votes() { return this.#votes; }
    get color() { return this.#color; }

    incrementVote() {
        this.#votes++;
        return this.#votes;
    }

    toJSON() {
        return {
            name: this.#name,
            votes: this.#votes,
            color: this.#color
        };
    }
}