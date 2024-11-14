// 기본 제네릭 예제
function identity<T>(value: T): T {
    return value;
}

console.log(identity<string>("Hello")); // "Hello"
console.log(identity<number>(42));      // 42
