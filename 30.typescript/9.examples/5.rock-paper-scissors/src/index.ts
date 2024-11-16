type Choice = 'rock' | 'paper' | 'scissors';

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
const playerChoice: Choice = 'rock'; // Replace with user input
const computerChoice: Choice = choices[Math.floor(Math.random() * choices.length)];

console.log(`Player: ${playerChoice}, Computer: ${computerChoice}`);
console.log(determineWinner(playerChoice, computerChoice));
