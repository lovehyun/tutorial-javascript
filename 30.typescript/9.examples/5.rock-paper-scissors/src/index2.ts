import readline from 'readline';

// Type definition includes 'exit' for handling exit condition
type Choice = 'rock' | 'paper' | 'scissors' | 'exit';

function determineWinner(playerChoice: Choice, computerChoice: Choice): string {
    if (playerChoice === computerChoice) return "It's a tie!";
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'Player wins!';
    }
    return 'Computer wins!';
}

const choices: Choice[] = ['rock', 'paper', 'scissors'];
let wins = 0;
let losses = 0;
let ties = 0;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function playGame(): void {
    const computerChoice: Choice = choices[Math.floor(Math.random() * choices.length)];

    rl.question('Choose rock, paper, or scissors (or type "exit" to quit): ', (input) => {
        const playerChoice = input.trim().toLowerCase() as Choice;

        if (playerChoice === 'exit') {
            console.log('Thanks for playing!');
            console.log(`Final stats: Wins: ${wins}, Ties: ${ties}, Losses: ${losses}`);
            rl.close();
            return;
        }

        if (!choices.includes(playerChoice)) {
            console.log('Invalid choice. Please choose rock, paper, or scissors.');
            return playGame(); // 다시 입력 요청
        }

        console.log(`Player: ${playerChoice}, Computer: ${computerChoice}`);
        const result = determineWinner(playerChoice, computerChoice);

        if (result === "It's a tie!") {
            ties++;
        } else if (result === 'Player wins!') {
            wins++;
        } else {
            losses++;
        }

        console.log(result);
        console.log(`Current stats: Wins: ${wins}, Ties: ${ties}, Losses: ${losses}`);
        playGame(); // 다음 라운드
    });
}

// 게임 시작
console.log('Welcome to Rock-Paper-Scissors!');
playGame();
