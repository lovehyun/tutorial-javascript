const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function numberGuessingGame() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    function askGuess() {
        rl.question('1부터 100 사이의 숫자를 맞춰보세요: ', (answer) => {
            const guess = parseInt(answer);
            attempts++;

            if (guess > randomNumber) {
                console.log('더 작은 숫자입니다.');
                askGuess();
            } else if (guess < randomNumber) {
                console.log('더 큰 숫자입니다.');
                askGuess();
            } else {
                console.log(`정답입니다! ${attempts}번 만에 맞췄습니다.`);
                rl.close();
            }
        });
    }

    askGuess();
}

numberGuessingGame();
