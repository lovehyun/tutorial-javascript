class Calculator {
    add(num1, num2) {
        return num1 + num2;
    }

    subtract(num1, num2) {
        return num1 - num2;
    }

    multiply(num1, num2) {
        return num1 * num2;
    }

    divide(num1, num2) {
        if (num2 === 0) {
            return "Error: Division by zero is not allowed";
        }
        return num1 / num2;
    }

    calculate(num1, operator, num2) {
        switch (operator) {
            case '+':
                return this.add(num1, num2);
            case '-':
                return this.subtract(num1, num2);
            case '*':
                return this.multiply(num1, num2);
            case '/':
                return this.divide(num1, num2);
            default:
                return "Invalid operator";
        }
    }
}

class UserInput {
    constructor(calculator) {
        this.calculator = calculator;
        this.readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    start() {
        this.getUserInput();
    }

    getUserInput() {
        this.readline.question('Enter first number: ', (num1) => {
            this.readline.question('Enter operator (+, -, *, /): ', (operator) => {
                this.readline.question('Enter second number: ', (num2) => {
                    num1 = parseFloat(num1);
                    num2 = parseFloat(num2);
                    const result = this.calculator.calculate(num1, operator, num2);
                    console.log(`Result: ${result}`);
                    this.readline.close();
                });
            });
        });
    }
}

const calculator = new Calculator();
const userInput = new UserInput(calculator);
userInput.start();
