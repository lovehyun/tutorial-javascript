// function guessNumber(target: number, guess: number): 'Too low!' | 'Too high!' | 'Correct!' { // 리터럴(literal) 타입으로 명확히 할 수도 있음. (잘 안씀)
function guessNumber(target: number, guess: number): string {
    if (guess < target) return 'Too low!';
    if (guess > target) return 'Too high!';
    return 'Correct!';
}

const targetNumber: number = Math.floor(Math.random() * 100) + 1;
console.log('Target Number:', targetNumber);

const userGuess = 50; // Replace with user input in a real application
console.log(guessNumber(targetNumber, userGuess));
