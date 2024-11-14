// 제네릭을 사용한 클래스
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
