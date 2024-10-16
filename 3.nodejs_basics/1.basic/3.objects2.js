// 내장객체

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

// 1. Date
// 현재 날짜와 시간 가져오기
// const today = Date(); // 현재 날짜의 toString() 이 호출된 값.
const today = new Date(); // 현재 날짜의 객체 자체
console.log(today);


// 2. Math
// 수학적 연산 (예: 최댓값, 최솟값)
const maxNumber = Math.max(10, 20, 5);
console.log(maxNumber); // 20

const minNumber = Math.min(10, 20, 5);
console.log(minNumber); // 5

console.log(Math.round(4.6)); // 5
console.log(Math.floor(4.6)); // 4
console.log(Math.ceil(4.2)); // 5


// 3. String
// 문자열 길이 가져오기 - length = 속성(property)
const text = 'Hello, World!';
console.log(text.length); // 13

// 문자열 메서드 (예: 대문자 변환) - toUpperCase() = 메소드(method)
console.log(text.toUpperCase()); // HELLO, WORLD!
console.log(text.toLowerCase()); // 'hello, world!'
