// 제네릭을 사용한 함수
function wrapInArray<T>(value: T): T[] {
    return [value];
}

console.log(wrapInArray<number>(5));      // [5]
console.log(wrapInArray<string>("Hello")); // ["Hello"]


function getFirstElement<T>(array: T[]): T {
    return array[0];
}

console.log(getFirstElement([1, 2, 3]));      // 1 (T는 number로 추론)
console.log(getFirstElement<number>([1, 2, 3]));

console.log(getFirstElement(["a", "b", "c"])); // "a" (T는 string으로 추론)
console.log(getFirstElement<string>(["a", "b", "c"]));



function getFirstElement2<T>(array: T[]): T | undefined {
    return array[0];
}

function getLastElement2<T>(array: T[]): T | undefined {
    return array[array.length - 1]; // 마지막 요소 접근
}

function getMiddleElement2<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined; // 빈 배열 처리
    }
    const middleIndex = Math.floor(array.length / 2); // 중간 인덱스 계산
    return array[middleIndex];
}

// 예제 사용
const numbers = [10, 20, 30, 40, 50];

console.log(`First: ${getFirstElement2(numbers)}`);   // First: 10
console.log(`Last: ${getLastElement2(numbers)}`);     // Last: 50
console.log(`Middle: ${getMiddleElement2(numbers)}`); // Middle: 30

const middle: number | undefined = getMiddleElement2([1, 2, 3]);
console.log(middle); // 2

const middle2: number | undefined = getMiddleElement2([]);
console.log(middle2);
if (middle2 !== undefined) {
    console.log(`Middle element: ${middle2}`);
} else {
    console.log("Array is empty, no middle element.");
}

const middle3: number = getMiddleElement2([1, 2, 3]) ?? -1; // 기본값 -1 설정
console.log(middle3); // 2

const middleEmpty: number = getMiddleElement2([]) ?? -1; // 빈 배열 처리
console.log(middleEmpty); // -1

// strictNullChecks가 false인 경우
// TypeScript의 strictNullChecks 옵션이 false인 경우, undefined는 number 타입에 할당될 수 있습니다. 
// 그러나 이 설정은 비권장됩니다. strictNullChecks는 TypeScript의 엄격한 타입 체크를 활성화하여 더 안전한 코드를 작성하도록 도와줍니다.
