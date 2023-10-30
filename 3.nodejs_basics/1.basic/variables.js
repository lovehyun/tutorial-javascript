// 1. 숫자형 변수 (Number Variables)
// 정수형 변수
let a = 10;

// 부동 소수점 변수
let pi = 3.14;

// 변수 간 연산
let sum = a + pi;
console.log(sum);

// 상수 (Constants)
const gravity = 9.81;
// gravity = 10; // 상수는 재할당할 수 없음 (에러 발생)


// 2. 문자열 변수 (String Variables)
let name = "John Doe";
let greeting = "Hello, " + name;
console.log(greeting);


// 3. 불린형 변수 (Boolean Variables)
let isLogged = true;
let hasPermission = false;

if (isLogged) {
  console.log("사용자가 로그인했습니다.");
} else {
  console.log("로그인이 필요합니다.");
}


// 4. 배열 (Arrays)
let numbers = [1, 2, 3, 4, 5];
console.log(numbers[2]); // 배열의 세 번째 요소 출력

// 배열 반복문
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}


// 5. 객체 (Objects)
let person = {
  name: "Alice",
  age: 30,
  profession: "Engineer"
};

console.log(person.name); // 객체의 속성 값 출력


// 6. 변수의 범위 (Variable Scope)
let globalVar = "전역 변수";

function scopeExample() {
  let localVar = "지역 변수";
  console.log(globalVar); // 전역 변수 접근 가능
  console.log(localVar);
}

scopeExample();
// console.log(localVar); // 지역 변수는 함수 외부에서 접근 불가 (에러 발생)
