// 매개변수 a와 b는 number 타입이며, 반환 타입도 number입니다.
function add(a: number, b: number): number {
    return a + b;
}

const sum: number = add(10, 20);
console.log(`Sum: ${sum}`); // Sum: 30


// 리턴 타입이 없는 경우
function logMessage(message: string): void {
    console.log(`Message: ${message}`);
}

// 함수 호출
logMessage("Hello, TypeScript!");
