// calculator.js

// CommonJS 모듈 방식에서의 module.exports 사용
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "0으로 나눌 수 없습니다.";
    } else {
        return a / b;
    }
}

// 모듈 내보내기
module.exports = {
    add,
    subtract,
    multiply,
    divide
};
