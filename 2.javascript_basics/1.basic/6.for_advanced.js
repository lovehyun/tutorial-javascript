// 5. 반복문
/*
[ 실무 응용 패턴 요약표 ]
패턴	특징	실무 활용도
for	기본 반복	중급, 배열 순회
for...of	배열/문자열 요소 직접 순회	매우 자주 사용
for...in	객체 속성 순회	자주 사용
forEach	배열 순회 (break 불가)	가장 자주 사용
map	배열 변환	실무 필수
filter	조건 추출	실무 필수
find	요소 검색	실무 필수
reduce	집계, 누적 계산	실무 필수
*/

// JavaScript for의 다양한 형태 및 실무 응용
// 1. for 기본형
for (let i = 0; i < 5; i++) {
    console.log(i);
}
// ➜ 반복 횟수가 명확할 때 가장 기본적으로 사용

// 2. for - 배열 순회
let fruits = ["Apple", "Banana", "Cherry"];

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}
// ➜ 배열의 인덱스를 이용한 전통적인 순회

// 3. for...of (배열 요소 직접 순회)
for (let fruit of fruits) {
    console.log(fruit);
}
// ➜ 배열/문자열 요소를 "값" 기준으로 순회
// ➜ 실무에서 매우 많이 사용

// 4. for...in (객체 속성 순회)
let person = { name: "John", age: 30, city: "Seoul" };

for (let key in person) {
    console.log(key, ":", person[key]);
}
// ➜ 객체의 key 값을 순회할 때 사용
// ➜ 주의: 배열에서도 사용할 수 있지만 인덱스를 key로 순회하기 때문에 배열에는 비추천

// 5. forEach (배열 전용 메서드)
let numbers = [1, 2, 3, 4, 5, 6];

numbers.forEach(function (number, index) {
    console.log(`Index: ${index}, Value: ${number}`);
});

// 화살표 함수 버전
numbers.forEach((number) => {
    console.log("Value:", number);
});
// ➜ 가장 많이 사용하는 실무 배열 순회 패턴
// ➜ break, continue 사용 불가


// ---------------------------------------------

// 6. map (새로운 배열 만들기)
let squares = numbers.map((num) => num * num);

console.log(squares);
// ➜ 배열을 가공하여 새 배열을 만들 때 사용
// ➜ 원본 배열은 유지

// 7. filter (조건에 맞는 요소 추출)
let evenNumbers = numbers.filter((num) => num % 2 === 0);

console.log(evenNumbers);
// ➜ 조건에 맞는 요소만 뽑아서 새 배열 생성

// 8. find (첫 번째 일치하는 요소 찾기)
let users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

let user = users.find((user) => user.id === 2);
console.log(user);
// ➜ 조건에 맞는 "첫 번째 요소" 반환 (없으면 undefined)

// 9. reduce (누적 합산, 집계)
let total = numbers.reduce((acc, num) => acc + num, 0);
console.log("합계:", total);
// ➜ 합계, 곱, 통계 계산 등 집계 작업에 매우 많이 사용
