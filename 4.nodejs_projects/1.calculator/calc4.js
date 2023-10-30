class GenericCalculator {
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

    operate(operator, num1, num2) {
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

class EngineeringCalculator extends GenericCalculator {
    // 추가적인 공학용 계산 메서드 구현
    // 예: 지수, 로그, 삼각함수 등
    // 지수 함수 (exponential function)
    exponential(num, power) {
        return Math.pow(num, power);
    }

    // 로그 함수 (logarithmic function)
    logarithm(num, base) {
        return Math.log(num) / Math.log(base);
    }
}

class StandardCalculator extends GenericCalculator {
    // 추가적인 일반 계산 메서드 구현
    // 예: 제곱근, 반올림, 기타 수학 함수 등
}

class ProgrammerCalculator extends GenericCalculator {
    // 추가적인 프로그래머용 계산 메서드 구현
    // 예: 비트 연산, 진법 변환, 기타 프로그래머 관련 계산 등
}

// 사용자 모드 입력을 받는 부분
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
        calculator = new EngineeringCalculator();
    } else if (mode === '2') {
        calculator = new StandardCalculator();
    } else if (mode === '3') {
        calculator = new ProgrammerCalculator();
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
