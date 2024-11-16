function guessNumber(target: number, guess: number): string {
    if (guess < target) return 'Too low!';
    if (guess > target) return 'Too high!';
    return 'Correct!';
}

const targetNumber = Math.floor(Math.random() * 100) + 1;
console.log('Target Number:', targetNumber);

const userGuess = 50; // Replace with user input in a real application
console.log(guessNumber(targetNumber, userGuess));
