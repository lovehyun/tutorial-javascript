// 선택적 매개변수 greeting, 기본값이 있는 매개변수 name
function greet(name: string = "Guest", greeting?: string): string {
    if (greeting) {
        return `${greeting}, ${name}!`;
    }
    return `Hello, ${name}!`;
}

console.log(greet());                // Hello, Guest!
console.log(greet("Alice"));          // Hello, Alice!
console.log(greet("Alice", "Hi"));    // Hi, Alice!
