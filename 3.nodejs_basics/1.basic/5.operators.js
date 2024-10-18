// 산술 연산자(Arithmetic Operators)
let a = 10;
let b = 5;

console.log(a + b); // 덧셈: 15
console.log(a - b); // 뺄셈: 5
console.log(a * b); // 곱셈: 50
console.log(a / b); // 나눗셈: 2
console.log(a % b); // 나머지: 0
console.log(a ** b); // 거듭제곱: 100000


// 할당 연산자(Assignment Operators)
let x = 10;

x += 5; // x = x + 5;
console.log(x); // 15 출력

x -= 3; // x = x - 3;
console.log(x); // 12 출력

x *= 2; // x = x * 2;
console.log(x); // 24 출력


// 비교 연산자(Comparison Operators)
// 동등 비교 연산자(==)
console.log(5 == '5'); // true (자료형을 변환하여 비교)
console.log(0 == false); // true

// 엄격 동등 비교 연산자(===)
console.log(5 === '5'); // false (자료형이 다르므로)
console.log(0 === false); // false (자료형이 다르므로)

// 부등 비교 연산자
let p = 10;
let q = 5;

console.log(p > q); // 크다: true
console.log(p < q); // 작다: false
console.log(p >= q); // 크거나 같다: true
console.log(p <= q); // 작거나 같다: false
console.log(p === q); // 같다: false
console.log(p !== q); // 같지 않다: true
// >==와 <==는 JavaScript에서 유효한 연산자가 아닙니다. 문법 오류가 발생합니다. 
// JavaScript에서는 항상 >=(크거나 같다) 또는 <=(작거나 같다)를 사용해야 합니다.


// 논리 연산자(Logical Operators)
let sunny = true;
let warm = false;

console.log(sunny && warm); // 논리 AND: false
console.log(sunny || warm); // 논리 OR: true
console.log(!sunny); // 논리 NOT: false


// 증가/감소 연산자(Increment/Decrement Operators)
let num = 5;

num++; // 후위 증가 연산자: num = num + 1;
console.log(num); // 6 출력

num--; // 후위 감소 연산자: num = num - 1;
console.log(num); // 5 출력


// Quiz
// 아래 표현의 결과는? (true)
console.log(5 + 2 === 7 && 4 > 5 || 'Hi' === 'Hi');

// 주의사항
console.log(null == undefined); // true (자료형을 변환하여 동등)
console.log(null === undefined); // false (자료형이 다름)

// 비교 연산에서 NaN은 어떤 값과도 같지 않습니다.
console.log(NaN === NaN); // false