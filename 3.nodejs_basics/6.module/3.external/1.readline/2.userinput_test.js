const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Before calling question()");

rl.question("Enter something: ", (answer) => {
    console.log(`Your answer: ${answer}`);
    rl.close();
});

console.log("After calling question()");
