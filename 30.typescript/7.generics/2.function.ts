// 제네릭을 사용한 함수
function wrapInArray<T>(value: T): T[] {
    return [value];
}

console.log(wrapInArray<number>(5));      // [5]
console.log(wrapInArray<string>("Hello")); // ["Hello"]
