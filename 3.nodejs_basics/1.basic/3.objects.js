// 1. 개체(Object) 생성
// 개체 생성
const obj = { a: 1, b: 2, c: 3};

console.log(typeof obj); // object
console.log(Object.keys(obj)); // ['a', 'b', 'c'] 출력
console.log(Object.values(obj)); // [1, 2, 3] 출력

// typeof 연산자가 반환하는 값은
// "number", "string", "boolean", "undefined", "object", "function", "symbol", "bigint"

const obj1 = new Object(); // Object 생성자를 사용
const obj2 = {}; // 객체 리터럴을 사용
const obj3 = obj1;

console.log(obj1); // {}
console.log(obj2); // {}

console.log(obj1 == obj2); // false
console.log(typeof obj1 === typeof obj2); // true
console.log(obj1 === obj3); // true


// 2. 객체 속성에 접근
let person = {
    name: "Alice",
    age: 30,
    profession: "Engineer"
};

console.log(person.name); // "Alice" 출력
console.log(person.age); // 30 출력
console.log(person.profession); // "Engineer" 출력


// 3. 객체 속성 추가 및 변경
// 새로운 속성 추가
person.location = "New York";

// 기존 속성 값 변경
person.age = 31;

console.log(person); // 모든 속성과 값이 있는 객체 출력

// 추가한 속성 삭제
delete person.location

console.log(person);


// 4. 객체 메소드(Method) 추가
let car = {
    brand: "Hyundai",
    year: 2020,
    start: function () {
        return "Engine started";
    },
    stop: function () {
        return "Engine stopped";
    }
};

console.log(car.start()); // "Engine started" 출력
console.log(car.stop()); // "Engine stopped" 출력

car.name = "K5";


// 5. 객체 내부 루프 (for...in) 활용
// 객체 내 속성 반복
for (let key in person) {
    console.log(`${key}: ${person[key]}`);
}
