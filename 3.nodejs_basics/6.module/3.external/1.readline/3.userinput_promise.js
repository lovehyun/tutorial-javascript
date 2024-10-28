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

console.log("Before calling question()");

/*
askQuestion("Enter something: ")
    .then((answer) => {
        console.log(`Your answer: ${answer}`);
    })
    .then(() => {
        console.log("After calling question()");
    });
*/

askQuestion("Enter the first input: ")
    .then((firstAnswer) => {
        console.log(`First answer: ${firstAnswer}`);
        return askQuestion("Enter the second input: "); // 두 번째 질문
    })
    .then((secondAnswer) => {
        console.log(`Second answer: ${secondAnswer}`);
        console.log("After calling questions");
    });
