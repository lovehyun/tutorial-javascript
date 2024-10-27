const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// 기본 계산기 클래스
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

// 공학용 계산기 클래스
class EngineeringCalculator extends GenericCalculator {
    exponential(num, power) {
        return Math.pow(num, power);
    }

    logarithm(num, base = 10) {
        return Math.log(num) / Math.log(base);
    }

    sine(angle) {
        return Math.sin(angle * (Math.PI / 180)); // 각도를 라디안으로 변환
    }

    cosine(angle) {
        return Math.cos(angle * (Math.PI / 180)); // 각도를 라디안으로 변환
    }

    tangent(angle) {
        return Math.tan(angle * (Math.PI / 180)); // 각도를 라디안으로 변환
    }
}

// 표준 계산기 클래스
class StandardCalculator extends GenericCalculator {
    squareRoot(num) {
        return Math.sqrt(num);
    }

    powerOfTwo(num) {
        return Math.pow(num, 2);
    }

    round(num) {
        return Math.round(num);
    }
}

// 프로그래머 계산기 클래스
class ProgrammerCalculator extends GenericCalculator {
    binary(num) {
        return `Binary: ${num.toString(2)}`;
    }

    hexadecimal(num) {
        return `Hexadecimal: ${num.toString(16)}`;
    }

    bitwiseAnd(num1, num2) {
        return num1 & num2;
    }

    bitwiseOr(num1, num2) {
        return num1 | num2;
    }
}

// 사용자 모드 입력 및 확장된 기능 선택
console.log("Select Calculator Mode:");
console.log("1. Engineering Calculator");
console.log("2. Standard Calculator");
console.log("3. Programmer Calculator");

readline.question("Enter the mode (1/2/3): ", (mode) => {
    let calculator;

    switch (mode) {
        case '1':
            calculator = new EngineeringCalculator();
            console.log("Engineering Calculator: Available operations are +, -, *, /, exp (exponential), log, sin, cos, tan");
            break;
        case '2':
            calculator = new StandardCalculator();
            console.log("Standard Calculator: Available operations are +, -, *, /, sqrt (square root), pow2 (power of two), round");
            break;
        case '3':
            calculator = new ProgrammerCalculator();
            console.log("Programmer Calculator: Available operations are +, -, *, /, bin (binary), hex (hexadecimal), and, or");
            break;
        default:
            console.log("Invalid mode selection.");
            readline.close();
            return;
    }

    readline.question('Enter first number: ', (num1) => {
        readline.question('Enter operator (e.g., +, -, *, /, sqrt, exp, log, sin, bin, etc.): ', (operator) => {
            if (['sqrt', 'pow2', 'bin', 'hex', 'sin', 'cos', 'tan'].includes(operator)) {
                // 단일 인자를 사용하는 연산
                num1 = parseFloat(num1);
                let result;

                switch (operator) {
                    case 'sqrt':
                        result = calculator.squareRoot(num1);
                        break;
                    case 'pow2':
                        result = calculator.powerOfTwo(num1);
                        break;
                    case 'round':
                        result = calculator.round(num1);
                        break;
                    case 'bin':
                        result = calculator.binary(num1);
                        break;
                    case 'hex':
                        result = calculator.hexadecimal(num1);
                        break;
                    case 'sin':
                        result = calculator.sine(num1);
                        break;
                    case 'cos':
                        result = calculator.cosine(num1);
                        break;
                    case 'tan':
                        result = calculator.tangent(num1);
                        break;
                    default:
                        result = "Invalid operation";
                }

                console.log(`Result: ${result}`);
                readline.close();
            } else {
                // 두 개의 인자를 사용하는 연산
                readline.question('Enter second number: ', (num2) => {
                    num1 = parseFloat(num1);
                    num2 = parseFloat(num2);
                    let result;

                    switch (operator) {
                        case '+':
                        case '-':
                        case '*':
                        case '/':
                            result = calculator.operate(operator, num1, num2);
                            break;
                        case 'exp':
                            result = calculator.exponential(num1, num2);
                            break;
                        case 'log':
                            result = calculator.logarithm(num1, num2);
                            break;
                        case 'and':
                            result = calculator.bitwiseAnd(num1, num2);
                            break;
                        case 'or':
                            result = calculator.bitwiseOr(num1, num2);
                            break;
                        default:
                            result = "Invalid operation";
                    }

                    console.log(`Result: ${result}`);
                    readline.close();
                });
            }
        });
    });
});
