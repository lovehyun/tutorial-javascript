// Calculate 인터페이스 정의
interface Calculate {
    (a: number, b: number): number; // 두 숫자를 받아서 숫자를 반환하는 함수 타입
}

// Calculate 타입을 가지는 add 함수 정의
const add: Calculate = (a, b) => a + b;
console.log(`Add: ${add(5, 10)}`); // Add: 15


// Calculate 타입을 가지는 subtract 함수
const subtract: Calculate = (a, b) => a - b;
console.log(`Subtract: ${subtract(10, 5)}`); // Subtract: 5


// Calculate 타입을 가지는 multiply 함수 정의
const multiply: Calculate = (a, b) => a * b;
console.log(`Multiply: ${multiply(5, 10)}`); // Multiply: 50
