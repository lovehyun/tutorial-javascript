// 비트 연산자(Bitwise Operators)
let a = 5; // 0101
let b = 3; // 0011

console.log(a & b); // 비트 AND: 0001 (1)
console.log(a | b); // 비트 OR: 0111 (7)
console.log(a ^ b); // 비트 XOR: 0110 (6)
console.log(~a); // 비트 NOT: 1010 (-6)
console.log(a << 1); // 왼쪽 시프트: 1010 (10)
console.log(a >> 1); // 오른쪽 시프트: 0010 (2)


// 삼항 연산자(Ternary Operator)
let age = 20;
let message = (age >= 18) ? '성인입니다.' : '미성년자입니다.';
console.log(message); // "성인입니다." 출력


// typeof 연산자
let x;
console.log(typeof x); // "undefined" 출력

let y = 10;
console.log(typeof y); // "number" 출력

let name = "Alice";
console.log(typeof name); // "string" 출력


// in 연산자
let car = { make: "Toyota", model: "Corolla" };
console.log("make" in car); // true 출력
console.log("year" in car); // false 출력


// delete 연산자
let student = { name: "Alice", age: 25 };
console.log(student); // { name: "Alice", age: 25 }
delete student.age;
console.log(student); // { name: "Alice" }


// instanceof 연산자
function Car(make, model) {
  this.make = make;
  this.model = model;
}

let myCar = new Car("Honda", "Civic");
console.log(myCar instanceof Car); // true 출력

