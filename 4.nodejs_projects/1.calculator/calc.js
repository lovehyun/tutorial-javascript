// 콘솔을 통해 사용자로부터 입력을 받음
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// 계산기 함수
const calculator = (num1, operator, num2) => {
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 === 0) {
                return "Error: Division by zero is not allowed";
            }
            return num1 / num2;
        default:
            return "Invalid operator";
    }
};

readline.question('Enter first number: ', (num1) => {
    readline.question('Enter operator (+, -, *, /): ', (operator) => {
        readline.question('Enter second number: ', (num2) => {
            const result = calculator(parseFloat(num1), operator, parseFloat(num2));
            console.log(`Result: ${result}`);
            readline.close();
        });
    });
});

