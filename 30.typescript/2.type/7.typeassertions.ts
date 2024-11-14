// any 타입에 string으로 타입 단언
let someValue: any = "Hello, TypeScript";
let stringLength: number = (someValue as string).length;
console.log(`String Length (Type Assertion): ${stringLength}`);
