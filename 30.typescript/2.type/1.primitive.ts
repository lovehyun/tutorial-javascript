// index.ts

// 여기서 : string, : number처럼 타입을 명시적으로 선언하면, 
// 이후에 해당 변수에 다른 타입의 값을 할당하면 오류를 발생시킵니다.
// 타입을 생략하면, TypeScript가 초기값의 타입을 자동으로 추론합니다:

// 문자열 타입
let username: string = "John";
console.log(`Username: ${username}`);

// 숫자 타입
let age: number = 30;
console.log(`Age: ${age}`);

// 불리언 타입
let isAdmin: boolean = true;
console.log(`Is Admin: ${isAdmin}`);

// any 타입
let unknownValue: any = "This can be anything";
console.log(`Unknown Value (any): ${unknownValue}`);

// undefined 타입 : 이 변수는 undefined 타입만 가질 수 있습니다.
let undefinedValue: undefined = undefined;
console.log(`Undefined Value: ${undefinedValue}`);

// null 타입 : 이 변수는 null 타입만 가질 수 있습니다.
let nullValue: null = null;
console.log(`Null Value: ${nullValue}`);

let notype = null;
console.log(`No Type??: ${notype}`);
// notype = 1;
// notype = 'a';

let notype2;
notype2 = 1;
notype2 = 'a';
