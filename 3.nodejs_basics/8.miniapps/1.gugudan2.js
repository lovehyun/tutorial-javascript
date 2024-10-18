const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function gugudan() {
    rl.question('몇 단을 출력할까요? ', (answer) => {
        const dan = parseInt(answer);
        for (let i = 1; i <= 9; i++) {
            console.log(`${dan} * ${i} = ${dan * i}`);
        }
        rl.close();
    });
}

gugudan();
