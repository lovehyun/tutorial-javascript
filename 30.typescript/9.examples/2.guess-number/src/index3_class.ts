// readline-sync는 Node.js 환경에서 동기적으로 사용자 입력을 처리할 수 있는 외부 패키지
// npm i @types/readline-sync 
// tsconfig 의 compierOptions에 추가 "skipLibCheck": true, 하면 성능 향상

import readlineSync from 'readline-sync';

class GuessNumberGame {
    private targetNumber: number;
    private attempts: number;
    private maxAttempts: number;

    constructor(maxAttempts: number = 10) {
        this.targetNumber = Math.floor(Math.random() * 100) + 1; // 1~100 사이의 숫자 생성
        this.attempts = 0;
        this.maxAttempts = maxAttempts;
    }

    private getFeedback(guess: number): string {
        if (guess < this.targetNumber) return 'Too low!';
        if (guess > this.targetNumber) return 'Too high!';
        return 'Correct!';
    }

    public play(): void {
        console.log('Welcome to the Guess Number Game!');
        console.log(`You have ${this.maxAttempts} attempts to guess the number between 1 and 100.`);

        while (this.attempts < this.maxAttempts) {
            const input = readlineSync.questionInt(`Attempt ${this.attempts + 1}: Enter your guess: `);

            this.attempts++;
            const feedback = this.getFeedback(input);

            if (feedback === 'Correct!') {
                console.log(
                    `Congratulations! You guessed the number ${this.targetNumber} in ${this.attempts} attempts.`
                );
                return;
            } else {
                console.log(feedback);
            }
        }

        console.log(
            `Sorry, you've used all ${this.maxAttempts} attempts. The correct number was ${this.targetNumber}.`
        );
    }
}

const game = new GuessNumberGame();
game.play();
