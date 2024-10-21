// 다른 JavaScript 파일에서 모듈 불러오기
import { add, subtract, multiply, divide } from './calculator.js';

// 사용 예시
let sum = add(5, 3);
console.log("덧셈 결과:", sum); // 결과: 8

let difference = subtract(10, 4);
console.log("뺄셈 결과:", difference); // 결과: 6

let product = multiply(6, 7);
console.log("곱셈 결과:", product); // 결과: 42

let quotient = divide(20, 4);
console.log("나눗셈 결과:", quotient); // 결과: 5
