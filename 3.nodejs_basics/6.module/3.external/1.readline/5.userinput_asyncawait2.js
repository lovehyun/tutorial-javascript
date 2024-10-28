const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

/*
(async () => {
    console.log("Before calling question()");

    // askQuestion을 await하여 동기적인 흐름처럼 사용
    const answer = await askQuestion("Enter something: ");
    console.log(`Your answer: ${answer}`);

    console.log("After calling question()");
})();
*/

(async () => {
    console.log("Before calling question()");

    // 첫 번째 질문
    const firstAnswer = await askQuestion("Enter the first input: ");
    console.log(`First answer: ${firstAnswer}`);

    // 두 번째 질문
    const secondAnswer = await askQuestion("Enter the second input: ");
    console.log(`Second answer: ${secondAnswer}`);

    console.log("After calling questions");
})();
