// 1. Primitive Type
const a = 5;  // 원시 타입 number
console.log(typeof a);  // 'number'
console.log(a instanceof Number);  // false


// 2. Object(Number) Type
const b = new Number(5);  // Number 객체
console.log(typeof b);  // 'object'
console.log(b instanceof Number);  // true
console.log(b instanceof Object);  // true


// 3. Primitive Type
const c = Number(5);

console.log(c);  // 출력: 5
console.log(typeof c);  // 출력: 'number'
console.log(c instanceof Number);  // 출력: false

// 프로토타입 체이닝 확인
console.log(c.__proto__); // {}, Number 자신의 프로토타입은 {} 객체
console.log(c.__proto__.__proto__); // Object 객체의 프로토타입은 null
console.log(c.__proto__.__proto__.__proto__); // null의 프로토타입은 없음


// 4. 자동 객체 변환
// 자바스크립트는 기본 데이터 타입을 **자동으로 객체로 변환하는 과정(autoboxing)**을 지원
console.log(a.toFixed(2));  // 출력: '5.00'
