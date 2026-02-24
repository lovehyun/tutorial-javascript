// npm install 필요 없음 - Node.js 기본 내장 모듈 (아래 node 기본 모듈 추가)
// npm i -D @types/node
import readline from 'readline';

function guessNumber(target: number, guess: number): string {
    if (guess < target) return 'Too low!';
    if (guess > target) return 'Too high!';
    return 'Correct!';
}

const targetNumber = Math.floor(Math.random() * 100) + 1;
console.log('🎯 1~100 사이 숫자를 맞춰보세요!');

let attempts = 0;
const maxAttempts = 7;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askGuess() {
    attempts++;

    rl.question(`(${attempts}/${maxAttempts}) 숫자를 입력하세요: `, (input) => {
        const userGuess = Number(input);

        if (isNaN(userGuess)) {
            console.log('❌ 숫자만 입력하세요.');
            attempts--; // 잘못된 입력은 횟수 차감 X
            return askGuess();
        }

        const result = guessNumber(targetNumber, userGuess);
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
