// 1. for...of
// for...of는 배열, 문자열, Map, Set과 같이 반복 가능한 객체의 요소를 반복합니다.
// 배열 요소, 문자열의 각 문자 또는 Map, Set의 값을 하나씩 가져와 반복하며, 해당 요소의 값 자체를 반환합니다.
const arr = [1, 2, 3];

for (const element of arr) {
  console.log(element);
}
// 출력: 1, 2, 3


// 2. for...in
// for...in은 객체의 열거 가능한 모든 속성을 반복합니다.
// 객체의 속성 이름을 반환하며, 해당 속성의 값에 접근하려면 속성 이름을 사용하여 객체에서 값을 가져와야 합니다.
const obj = { a: 1, b: 2, c: 3 };

for (const key in obj) {
  console.log(key, obj[key]);
}
// 출력: a 1, b 2, c 3


// ------------------------------------
// 실용 예제
// ------------------------------------
// 3. for...of 배열 순회 조희
const fruits = ['apple', 'banana', 'orange'];
for (const fruit of fruits) {
  console.log(fruit);
}
// 출력: apple, banana, orange


// 4. for...of 문자열 순회
const str = 'Hello';
for (const char of str) {
  console.log(char);
}
// 출력: 'H', 'e', 'l', 'l', 'o'


// 5. for...of Map 순회
const myMap = new Map();
myMap.set('key1', 'value1');
myMap.set('key2', 'value2');

for (const [key, value] of myMap) {
  console.log(`${key} - ${value}`);
}
// 출력: 'key1 - value1', 'key2 - value2'


// 6. for...in 객체 속성 순회
const car = {
  brand: 'Toyota',
  model: 'Camry',
  year: 2022
};

for (const prop in car) {
  console.log(`${prop}: ${car[prop]}`);
}
// 출력: 'brand: Toyota', 'model: Camry', 'year: 2022'


// 7. for...in 배열 인덱스 순회
const arr2 = ['a', 'b', 'c'];
for (const index in arr2) {
  console.log(index);
}
// 출력: '0', '1', '2'
