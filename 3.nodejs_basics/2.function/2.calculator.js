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

// 5. 부동소수점, IEEE 754
// JavaScript의 숫자 시스템은 기본적으로 IEEE 754 부동 소수점 방식을 사용합니다. 
// 일반적으로, 이 방식은 유효 숫자 15-17자리까지를 안정적으로 표현할 수 있습니다.
let result = multiply(9999999999, 9999999999);
console.log(result)
// 99999999980000000000 != 99999999980000000001

console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
let result2 = BigInt(9999999999) * BigInt(9999999999);
console.log(result2)


let sum2 = 0.0;
for (let i = 0; i < 10; i++) {
    sum2 += 0.01;
}
console.log(sum2);  // 출력: 0.09999999999999999 != 0.1


console.log(0.1 + 0.2);  // 출력: 0.30000000000000004 != 0.3
// 9.625 = 10진수
// 1001.101 = 2진수 => 2^3 + 2^0 . 1/2^1 + 1/2^3  => 0.5 + 0.125
// 그러나 0.1 은 1/2^4 + 1/2^5 + 1/2^8 + 1/2^9 + 1/2^12 + 1/2^13 + ...
//       0.1 = 0.0001100110011...
//
// javascript 에서는 int 없이 number 를 통해서 floating point 연산에 사용
// 1비트 sign + 31비트 숫자
// 고정소수점: 1bit + 15bit + 16bit (정수/소수)
// 부동소수점: 1bit + 8bit(shift) + 23bit(숫자표현) => 1.001101 x 10^n
