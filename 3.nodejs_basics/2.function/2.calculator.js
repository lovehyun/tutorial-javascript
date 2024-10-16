// 1. 덧셈 함수 (Addition Function)
function add(a, b) {
    return a + b;
}

// 예시
let sum = add(5, 3);
console.log("덧셈 결과:", sum); // 결과: 8


// 2. 뺄셈 함수 (Subtraction Function)
function subtract(a, b) {
    return a - b;
}

// 예시
let difference = subtract(10, 4);
console.log("뺄셈 결과:", difference); // 결과: 6


// 3. 곱셈 함수 (Multiplication Function)
function multiply(a, b) {
    return a * b;
}

// 예시
let product = multiply(6, 7);
console.log("곱셈 결과:", product); // 결과: 42


// 4. 나눗셈 함수 (Division Function)
function divide(a, b) {
    if (b === 0) {
        return "0으로 나눌 수 없습니다.";
    } else {
        return a / b;
    }
}

// 예시
let quotient = divide(20, 4);
console.log("나눗셈 결과:", quotient); // 결과: 5

// 참고
// JavaScript의 숫자 시스템은 기본적으로 IEEE 754 부동 소수점 방식을 사용합니다. 
// 일반적으로, 이 방식은 유효 숫자 15-17자리까지를 안정적으로 표현할 수 있습니다.
quotient = multiply(9999999999, 9999999999);
