// calculator.js

// ES6 모듈 방식에서의 export: 브라우저 및 최신 JavaScript 버전에서 사용됩니다.
// Node.js에서 ES6 모듈을 사용하기 위해서는 파일 확장자를 .mjs로 만들거나 package.json에 "type": "module"을 설정하여야 합니다.

export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

export function divide(a, b) {
    if (b === 0) {
        return "0으로 나눌 수 없습니다.";
    } else {
        return a / b;
    }
}
