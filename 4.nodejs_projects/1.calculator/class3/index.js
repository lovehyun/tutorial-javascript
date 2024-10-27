// index.js
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const EngineeringCalculator = require('./calculators/EngineeringCalculator');
const StandardCalculator = require('./calculators/StandardCalculator');
const ProgrammerCalculator = require('./calculators/ProgrammerCalculator');

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

    console.log(`\nAvailable operations: ${calculator.getSupportedOperators().join(', ')}\n`);

    readline.question('Enter first number: ', (num1) => {
        readline.question('Enter operator: ', (operator) => {
            // 유효한 연산자인지 확인
            if (!calculator.getSupportedOperators().includes(operator)) {
                console.log("Invalid operator. Please select a valid operator from:", calculator.getSupportedOperators().join(', '));
                readline.close();
                return;
            }

            // 연산자가 유효한 경우, 두 번째 숫자가 필요한지 확인 후 계산 수행
            readline.question('Enter second number: ', (num2) => {
                num1 = parseFloat(num1);
                num2 = num2 ? parseFloat(num2) : null;

                const result = calculator.calculate(operator, num1, num2);
                console.log(`Result: ${result}`);
                readline.close();
            });
        });
    });
});
