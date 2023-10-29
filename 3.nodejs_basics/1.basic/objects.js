// 1. 개체(Object) 생성
// 개체 생성
let person = {
    name: "Alice",
    age: 30,
    profession: "Engineer"
};

// 2. 객체 속성에 접근
console.log(person.name); // "Alice" 출력
console.log(person.age); // 30 출력
console.log(person.profession); // "Engineer" 출력


// 3. 객체 속성 추가 및 변경
// 새로운 속성 추가
person.location = "New York";

// 기존 속성 값 변경
person.age = 31;

console.log(person); // 모든 속성과 값이 있는 객체 출력


// 4. 객체 메소드(Method) 추가
let car = {
    brand: "Toyota",
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


// 5. 객체 내부 루프 (for...in) 활용
// 객체 내 속성 반복
for (let key in person) {
    console.log(`${key}: ${person[key]}`);
}
