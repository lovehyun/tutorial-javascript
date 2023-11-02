const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const EngineeringCalculator = require('./EngineeringCalculator');
const StandardCalculator = require('./StandardCalculator');
const ProgrammerCalculator = require('./ProgrammerCalculator');

console.log("Select Calculator Mode:");
console.log("1. Engineering Calculator");
console.log("2. Standard Calculator");
console.log("3. Programmer Calculator");

readline.question("Enter the mode (1/2/3): ", (mode) => {
    let calculator;

    switch (mode) {
        case '1':
            calculator = new EngineeringCalculator();
            break;
        case '2':
            calculator = new StandardCalculator();
            break;
        case '3':
            calculator = new ProgrammerCalculator();
            break;
        default:
            console.log("Invalid mode selection.");
            readline.close();
            return;
    }

    readline.question('Enter first number: ', (num1) => {
        readline.question('Enter operator (+, -, *, /): ', (operator) => {
            readline.question('Enter second number: ', (num2) => {
                num1 = parseFloat(num1);
                num2 = parseFloat(num2);
                const result = calculator.operate(operator, num1, num2);
                console.log(`Result: ${result}`);
                readline.close();
            });
        });
    });
});
