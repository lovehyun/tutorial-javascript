// 1. 함수 선언과 호출
// 함수 선언
function greet() {
  console.log("안녕하세요!");
}

// 함수 호출
greet(); // "안녕하세요!" 출력

// 2. 매개변수(Parameter)와 인수(Argument)
// 매개변수를 받는 함수
function greetByName(name) {
  console.log(`안녕, ${name}!`);
}

// 함수 호출 시 인수 전달
greetByName("Alice"); // "안녕, Alice!" 출력
greetByName("Bob"); // "안녕, Bob!" 출력


// 3. 반환문(Return Statement)
// 결과를 반환하는 함수
function add(a, b) {
  return a + b;
}

let result = add(3, 5);
console.log(result); // 8 출력


// 4. 익명 함수(Anonymous Function) 및 함수 표현식
// 익명 함수를 변수에 할당
let multiply = function(x, y) {
  return x * y;
};

console.log(multiply(4, 2)); // 8 출력


// 5. 화살표 함수(Arrow Function)
// 화살표 함수
let square = (num) => {
  return num * num;
};

console.log(square(4)); // 16 출력
