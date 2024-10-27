const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Select Calculator Mode:");
console.log("1. Engineering Calculator");
console.log("2. Standard Calculator");
console.log("3. Programmer Calculator");

readline.question("Enter the mode (1/2/3): ", (mode) => {
    let calculator;

    if (mode === '1') {
        calculator = new (require('./calculators/EngineeringCalculator'))();
    } else if (mode === '2') {
        calculator = new (require('./calculators/StandardCalculator'))();
    } else if (mode === '3') {
        calculator = new (require('./calculators/ProgrammerCalculator'))();
    } else {
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
