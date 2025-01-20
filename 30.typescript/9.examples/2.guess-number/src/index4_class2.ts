import readlineSync from 'readline-sync';
import iconv from 'iconv-lite';

// 한글 입력 지원
function readLineWithEncoding(prompt: string): string {
    const buffer = Buffer.from(readlineSync.question(prompt), 'binary');
    return iconv.decode(buffer, 'utf-8');
}

// Feedback 타입 정의
type Feedback = 'Too low!' | 'Too high!' | 'Correct!';

// Feedback 메시지 상수
const FEEDBACK_MESSAGES: Record<Feedback, string> = {
    'Too low!': 'Your guess is too low. Try again!',
    'Too high!': 'Your guess is too high. Try again!',
    'Correct!': 'You guessed it right!',
};

class GuessNumberGame {
    private targetNumber: number;
    private attempts: number;
    private maxAttempts: number;

    constructor(maxAttempts: number = 10) {
        if (!Number.isInteger(maxAttempts) || maxAttempts <= 0) {
            throw new Error('maxAttempts must be a positive integer.');
        }
        this.targetNumber = Math.floor(Math.random() * 100) + 1; // 1~100 사이의 숫자 생성
        this.attempts = 0;
        this.maxAttempts = maxAttempts;
    }

    private getFeedback(guess: number): Feedback {
        if (guess < this.targetNumber) return 'Too low!';
        if (guess > this.targetNumber) return 'Too high!';
        return 'Correct!';
    }

    public play(): void {
        console.log('Welcome to the Guess Number Game!');
        console.log(`You have ${this.maxAttempts} attempts to guess the number between 1 and 100.`);

        while (this.attempts < this.maxAttempts) {
            const inputString = readLineWithEncoding(`Attempt ${this.attempts + 1}: Enter your guess: `);

            // 숫자로 변환 시도
            const input = parseInt(inputString, 10);

            if (isNaN(input)) {
                console.log('Invalid input. Please enter a valid number.');
                continue;
            }
            
            this.attempts++;
            const feedback: Feedback = this.getFeedback(input);

            console.log(FEEDBACK_MESSAGES[feedback]);

            if (feedback === 'Correct!') {
                console.log(
                    `Congratulations! You guessed the number ${this.targetNumber} in ${this.attempts} attempts.`
                );
                return;
            }
        }

        console.log(
            `Sorry, you've used all ${this.maxAttempts} attempts. The correct number was ${this.targetNumber}.`
        );
    }
}

// 게임 실행
const game = new GuessNumberGame();
game.play();
