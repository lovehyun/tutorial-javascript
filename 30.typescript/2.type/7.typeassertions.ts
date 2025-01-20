// 1. as 문법
// any 타입에 string으로 타입 단언
let someValue: any = "Hello, TypeScript";
let stringLength: number = (someValue as string).length;
console.log(`String Length (Type Assertion): ${stringLength}`);

// 2. Angle Bracket <> 문법
let someValue2: unknown = "Hello, TypeScript";
let stringLength2: number = (<string>someValue2).length;

console.log(stringLength2); // 출력: 17
