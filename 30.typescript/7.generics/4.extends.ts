// 객체 타입만 허용하는 제네릭 함수
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(value: T): void {
    console.log(`Length: ${value.length}`);
}

logLength("Hello");            // Length: 5
logLength([1, 2, 3, 4, 5]);    // Length: 5
// logLength(42); // 오류 발생: number 타입에는 length 속성이 없음
