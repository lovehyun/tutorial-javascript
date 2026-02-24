// src/GameLogic.ts
export type GuessResult = 'Too low!' | 'Too high!' | 'Correct!';

export interface GuessResponse {
    result: GuessResult;
    attempts: number;
    maxAttempts: number;
    finished: boolean;
    target?: number; // 끝났을 때만 포함 (정답 공개용)
}

export class GameLogic {
    private target: number;
    private attempts = 0;

    constructor(
        private readonly maxAttempts: number = 7,
        private readonly min: number = 1,
        private readonly max: number = 100
    ) {
        this.target = this.random(min, max);
        // 디버깅용
        console.log(`🎯 New game started. Target = ${this.target}`);
    }

    private random(min: number, max: number): number {
        const minCeil = Math.ceil(min);
        const maxFloor = Math.floor(max);
        return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
    }

    public guess(value: number): GuessResponse {
        this.attempts++;

        let result: GuessResult;
        if (value < this.target) result = 'Too low!';
        else if (value > this.target) result = 'Too high!';
        else result = 'Correct!';

        const finished = result === 'Correct!' || this.attempts >= this.maxAttempts;

        return {
            result,
            attempts: this.attempts,
            maxAttempts: this.maxAttempts,
            finished,
            target: finished ? this.target : undefined,
        };
    }

    public reset(): void {
        this.attempts = 0;
        this.target = this.random(this.min, this.max);
        console.log(`🎯 Game reset. Target = ${this.target}`);
    }
}
