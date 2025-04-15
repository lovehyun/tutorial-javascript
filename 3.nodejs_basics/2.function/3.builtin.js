// 1. setTimeout
console.log('시작');

// 원형: setTimeout(function, delay);
setTimeout(() => {
    console.log('1초 후에 실행');
}, 1000);

console.log('끝');

// 타임아웃 취소
const timeoutId = setTimeout(() => {
    console.log('실행되지 않음');
}, 3000);

clearTimeout(timeoutId); // 바로 타이머를 취소


// 2. parseInt
const stringNumber = '42';
const number = parseInt(stringNumber);

console.log(typeof number); // number 출력
console.log(number); // 42 출력

// 참고. Number 객체
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number
const number2 = Number(stringNumber);
console.log(typeof number2);
console.log(number2);
const biggestNum = Number.MAX_VALUE;
const smallestNum = Number.MIN_VALUE;
const infiniteNum = Number.POSITIVE_INFINITY;
console.log(biggestNum, smallestNum, infiniteNum)


// 3. JSON
const user = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
};
  
const jsonString = JSON.stringify(user);
console.log(jsonString); // JSON 형식으로 변환된 문자열 출력
  
const parsedUser = JSON.parse(jsonString);
console.log(parsedUser.name); // 'John Doe' 출력
