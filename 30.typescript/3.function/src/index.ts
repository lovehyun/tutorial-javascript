// 1. 함수 타입
function add(a: number, b: number): number {
    return a + b;
}

const sum = add(10, 20);
console.log(`Sum: ${sum}`); // Sum: 30

// 2. 선택적 매개변수와 기본값
function greet(name: string = "Guest", greeting?: string): string {
    if (greeting) {
        return `${greeting}, ${name}!`;
    }
    return `Hello, ${name}!`;
}

console.log(greet());                // Hello, Guest!
console.log(greet("Alice"));          // Hello, Alice!
console.log(greet("Alice", "Hi"));    // Hi, Alice!

// 3. 함수 오버로드
function format(input: string): string;
function format(input: number): string;

function format(input: string | number): string {
    if (typeof input === "string") {
        return `String: ${input}`;
    } else {
        return `Number: ${input.toFixed(2)}`;
    }
}

console.log(format("Hello"));  // String: Hello
console.log(format(123.456));  // Number: 123.46

// 4. 화살표 함수
const multiply = (a: number, b: number): number => a * b;

console.log(`Multiply: ${multiply(5, 10)}`); // Multiply: 50

const introduce = (name: string = "Guest", age?: number): string => {
    return age ? `Hi, I'm ${name} and I'm ${age} years old.` : `Hi, I'm ${name}.`;
};

console.log(introduce());                 // Hi, I'm Guest.
console.log(introduce("Alice"));           // Hi, I'm Alice.
console.log(introduce("Alice", 30));       // Hi, I'm Alice and I'm 30 years old.
