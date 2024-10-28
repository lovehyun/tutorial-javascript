// npm install readline
// npm install deasync

const readline = require('readline');

// 사용자 입력을 동기적으로 처리하는 함수
function askQuestionSync(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let answer;
    const promise = new Promise((resolve) => {
        rl.question(query, (input) => {
            answer = input;
            rl.close();
            resolve();
        });
    });

    require('deasync').loopWhile(() => !answer); // 입력이 올 때까지 대기
    return answer;
}

// 사용 예시
console.log("Before calling question()");

const result = askQuestionSync("Enter something: ");
console.log(`Your answer: ${result}`);

console.log("After calling question()");
