// 숫자 맞추기 게임 클래스 버전 (Node.js용)

// npm install 불필요 - Node.js 기본 내장 모듈
import readline from 'readline';

type GuessResult = 'Too low!' | 'Too high!' | 'Correct!';

class NumberGuessGame {
    private targetNumber: number;              // 정답 숫자
    private attempts: number = 0;              // 현재 시도 횟수
    private readonly maxAttempts: number;      // 최대 시도 횟수
    private readonly min: number;              // 최소 값
    private readonly max: number;              // 최대 값
    private rl: readline.Interface;            // readline 인터페이스

    constructor(maxAttempts = 7, min = 1, max = 100) {
        this.maxAttempts = maxAttempts;
        this.min = min;
        this.max = max;
        this.targetNumber = this.getRandomInt(min, max);

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log(`🎯 ${this.min}~${this.max} 사이 숫자를 맞춰보세요!`);
        // 디버깅용으로 정답 보고 싶으면 ↓ 주석 해제
        // console.log('DEBUG target =', this.targetNumber);
    }

    // 무작위 정수 생성
    private getRandomInt(min: number, max: number): number {
        const minCeil = Math.ceil(min);
        const maxFloor = Math.floor(max);
        return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
    }

    // 추측 결과 판정
    private checkGuess(guess: number): GuessResult {
        if (guess < this.targetNumber) return 'Too low!';
        if (guess > this.targetNumber) return 'Too high!';
        return 'Correct!';
    }

    // 게임 시작 (외부에서 호출하는 진입점)
    public start(): void {
        this.askGuess();
    }

    // 사용자에게 숫자를 입력받는 부분
    // 화살표 함수로 정의해서 this 바인딩 문제 방지
    private askGuess = (): void => {
        this.attempts++;

        this.rl.question(`(${this.attempts}/${this.maxAttempts}) 숫자를 입력하세요: `, (input) => {
            const userGuess = Number(input);

            if (isNaN(userGuess)) {
                console.log('❌ 숫자만 입력하세요.');
                this.attempts--; // 잘못된 입력은 시도 횟수에서 제외
                this.askGuess();
                return;
            }

            const result = this.checkGuess(userGuess);
            console.log(result);

            if (result === 'Correct!') {
                console.log('🎉 축하합니다! 정답입니다!');
                this.rl.close();
                return;
            }

            if (this.attempts < this.maxAttempts) {
                this.askGuess();
            } else {
                console.log(`❌ 실패! 정답은 ${this.targetNumber}였습니다.`);
                this.rl.close();
            }
        });
    };
}

// 실제 실행 부분
const game = new NumberGuessGame(7, 1, 100);
game.start();
