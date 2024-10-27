const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// 덧셈 함수
const add = (num1, num2) => {
    return num1 + num2;
};

// 뺄셈 함수
const subtract = (num1, num2) => {
    return num1 - num2;
};

// 곱셈 함수
const multiply = (num1, num2) => {
    return num1 * num2;
};

// 나눗셈 함수
const divide = (num1, num2) => {
    if (num2 === 0) {
        return "Error: Division by zero is not allowed";
    }
    return num1 / num2;
};

// 연산자를 분석하고 해당 연산을 수행하는 함수
const operate = (operator, num1, num2) => {
    switch (operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '*':
            return multiply(num1, num2);
        case '/':
            return divide(num1, num2);
        default:
            return "Invalid operator";
    }
};

// 사용자 입력을 받는 함수
const getUserInput = () => {
    readline.question('Enter first number: ', (num1) => {
        readline.question('Enter operator (+, -, *, /): ', (operator) => {
            readline.question('Enter second number: ', (num2) => {
                num1 = parseFloat(num1);
                num2 = parseFloat(num2);
                const result = operate(operator, num1, num2);
                console.log(`Result: ${result}`);
                readline.close();
            });
        });
    });
};

getUserInput(); // 함수 호출

