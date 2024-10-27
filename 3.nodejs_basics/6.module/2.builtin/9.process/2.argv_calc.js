const [num1, operator, num2] = process.argv.slice(2);
const a = parseFloat(num1);
const b = parseFloat(num2);

switch (operator) {
    case '+':
        console.log(`${a} + ${b} = ${a + b}`);
        break;
    case '-':
        console.log(`${a} - ${b} = ${a - b}`);
        break;
    case '*':
        console.log(`${a} * ${b} = ${a * b}`);
        break;
    case '/':
        console.log(`${a} / ${b} = ${a / b}`);
        break;
    default:
        console.log("올바른 연산자를 입력하세요 (+, -, *, /)");
}
