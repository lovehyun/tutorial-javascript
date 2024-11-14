// 화살표 함수로 add 함수 정의
const multiply = (a: number, b: number): number => a * b;

console.log(`Multiply: ${multiply(5, 10)}`); // Multiply: 50

// 화살표 함수로 선택적 매개변수와 기본값 사용하기
const introduce = (name: string = "Guest", age?: number): string => {
    return age ? `Hi, I'm ${name} and I'm ${age} years old.` : `Hi, I'm ${name}.`;
};

console.log(introduce());                 // Hi, I'm Guest.
console.log(introduce("Alice"));           // Hi, I'm Alice.
console.log(introduce("Alice", 30));       // Hi, I'm Alice and I'm 30 years old.
