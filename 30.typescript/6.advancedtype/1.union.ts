// `number` 또는 `string` 타입을 가질 수 있는 유니언 타입 변수
let value: number | string;

value = 42;
console.log(`Value as number: ${value}`); // Value as number: 42

value = "Hello";
console.log(`Value as string: ${value}`); // Value as string: Hello

// 유니언 타입을 매개변수로 사용한 함수
function printId(id: number | string) {
    console.log(`ID: ${id}`);
}

printId(123);      // ID: 123
printId("abc123"); // ID: abc123
