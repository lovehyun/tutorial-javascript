// 1. 기본 제네릭
function identity<T>(value: T): T {
    return value;
}

console.log(identity<string>("Hello")); // "Hello"
console.log(identity<number>(42));      // 42

// 2. 제네릭 함수와 클래스
function wrapInArray<T>(value: T): T[] {
    return [value];
}

console.log(wrapInArray<number>(5));      // [5]
console.log(wrapInArray<string>("Hello")); // ["Hello"]

class Box<T> {
    private contents: T;

    constructor(contents: T) {
        this.contents = contents;
    }

    getContents(): T {
        return this.contents;
    }
}

const numberBox = new Box<number>(123);
console.log(numberBox.getContents()); // 123

const stringBox = new Box<string>("Hello");
console.log(stringBox.getContents()); // "Hello"

// 3. 제네릭 제약
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(value: T): void {
    console.log(`Length: ${value.length}`);
}

logLength("Hello");
logLength([1, 2, 3, 4, 5]);

// 4. 제네릭 인터페이스
interface KeyValuePair<K, V> {
    key: K;
    value: V;
}

const pair1: KeyValuePair<string, number> = { key: "age", value: 30 };
console.log(`Key: ${pair1.key}, Value: ${pair1.value}`);

const pair2: KeyValuePair<number, string> = { key: 1, value: "one" };
console.log(`Key: ${pair2.key}, Value: ${pair2.value}`);
