// 기본 타입 예제
let username: string = "John";
console.log(`Username: ${username}`);

let age: number = 30;
console.log(`Age: ${age}`);

let isAdmin: boolean = true;
console.log(`Is Admin: ${isAdmin}`);

let unknownValue: any = "This can be anything";
console.log(`Unknown Value (any): ${unknownValue}`);

let undefinedValue: undefined = undefined;
console.log(`Undefined Value: ${undefinedValue}`);

let nullValue: null = null;
console.log(`Null Value: ${nullValue}`);

// 배열 예제
let numbers: number[] = [1, 2, 3, 4, 5];
console.log(`Numbers: ${numbers}`);

let names: string[] = ["Alice", "Bob", "Charlie"];
console.log(`Names: ${names}`);

// 튜플 예제
let person: [string, number] = ["Alice", 30];
console.log(`Person Tuple: Name - ${person[0]}, Age - ${person[1]}`);

// 열거형 예제
enum Direction {
    Up,
    Down,
    Left,
    Right
}
let move: Direction = Direction.Up;
console.log(`Move Direction: ${Direction[move]}`);

// 유니언 타입 예제
let id: number | string;
id = 123;
console.log(`ID as number: ${id}`);
id = "ABC";
console.log(`ID as string: ${id}`);

// 타입 추론 예제
let greeting = "Hello";
console.log(`Greeting: ${greeting}`);

// 타입 단언 예제
let someValue: any = "Hello, TypeScript";
let stringLength: number = (someValue as string).length;
console.log(`String Length (Type Assertion): ${stringLength}`);

// 리터럴 타입 예제
let direction: "left" | "right" | "up" | "down";
direction = "left";
console.log(`Direction: ${direction}`);
