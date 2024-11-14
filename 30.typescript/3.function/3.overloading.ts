// 함수 오버로드 정의
function format(input: string): string;
function format(input: number): string;

// 함수 구현
function format(input: string | number): string {
    if (typeof input === "string") {
        return `String: ${input}`;
    } else {
        return `Number: ${input.toFixed(2)}`;
    }
}

console.log(format("Hello"));  // String: Hello
console.log(format(123.456));  // Number: 123.46
