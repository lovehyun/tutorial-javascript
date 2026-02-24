// GameLogic.ts
export type GuessResult = 'Too low!' | 'Too high!' | 'Correct!';

export class GameLogic {
    private target: number;

    constructor(private min = 1, private max = 100) {
        this.target = this.random(min, max);
    }

    private random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public check(guess: number): GuessResult {
        if (guess < this.target) return 'Too low!';
        if (guess > this.target) return 'Too high!';
        return 'Correct!';
    }

    public getTarget(): number {
        return this.target;
    }
}
