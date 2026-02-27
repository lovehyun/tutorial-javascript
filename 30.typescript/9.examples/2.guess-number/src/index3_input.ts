// npm install 필요 없음 - Node.js 기본 내장 모듈 (아래 node 기본 모듈 추가)
// npm i -D @types/node
import * as readline from 'readline'; // Node 내장 모듈 전체 임포트

// readline 인터페이스 타입 명시
const rl: readline.Interface = readline.createInterface({
    input: process.stdin,   // NodeJS.ReadStream
    output: process.stdout  // NodeJS.WriteStream
});

// 시도 횟수 관련 변수 타입
let attempts: number = 0;
const maxAttempts: number = 7;

// 목표 숫자 타입
const targetNumber: number = Math.floor(Math.random() * 100) + 1;
console.log('🎯 1~100 사이 숫자를 맞춰보세요!');

// 숫자 비교 함수 타입
function guessNumber(target: number, guess: number): string {
    if (guess < target) return 'Too low!';
    if (guess > target) return 'Too high!';
    return 'Correct!';
}

// 게임 진행 함수 타입 (반환값 없음 → void)
function askGuess(): void {
    attempts++;

    rl.question(`(${attempts}/${maxAttempts}) 숫자를 입력하세요: `, (input: string): void => {
        const userGuess: number = Number(input);

        if (isNaN(userGuess)) {
            console.log('❌ 숫자만 입력하세요.');
            attempts--; // 잘못된 입력은 횟수 차감 X
            askGuess();
            return;
        }

        const result: string = guessNumber(targetNumber, userGuess);
        console.log(result);

        if (result === 'Correct!') {
            console.log('🎉 축하합니다! 정답입니다!');
            rl.close();
            return;
        }

        if (attempts < maxAttempts) {
            askGuess(); // 다음 입력 요청
        } else {
            console.log(`❌ 실패! 정답은 ${targetNumber}였습니다.`);
            rl.close();
        }
    });
}

askGuess();
