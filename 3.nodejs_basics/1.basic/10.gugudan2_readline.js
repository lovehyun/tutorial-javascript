const readline = require('readline');

// 1. 단 하나를 출력하는 함수
function gugudan(dan) {
    console.log(`\n=== ${dan}단 ===`);
    for (let j = 1; j <= 9; j++) {
        console.log(`${dan} * ${j} = ${dan * j}`);
    }
}

// 2. readline 인터페이스 생성
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 3. 사용자에게 입력 받기
rl.question('원하는 단을 입력하세요 (2~9): ', (answer) => {
    const dan = parseInt(answer);

    if (isNaN(dan) || dan < 2 || dan > 9) {
        console.log('⚠ 2에서 9 사이의 숫자를 입력해 주세요.');
    } else {
        gugudan(dan);
    }

    rl.close(); // 입력 종료
});
