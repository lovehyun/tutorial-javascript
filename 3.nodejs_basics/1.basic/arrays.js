// 1. 배열 생성
// 배열 생성
const numbers = [1, 2, 3, 4, 5];
const fruits = ['Apple', 'Banana', 'Orange'];
const mixedArray = [1, 'hello', true, null, { key: 'value' }];


// 2. 배열 요소 접근
// 배열 요소 접근
console.log(numbers[0]); // 첫 번째 요소에 접근
console.log(fruits.length); // 배열 길이 출력
console.log(mixedArray[mixedArray.length - 1]); // 마지막 요소에 접근


// 3.배열 요소 변경
// 배열 요소 변경
fruits[1] = 'Grapes'; // 두 번째 요소 변경
console.log(fruits); // 변경된 배열 출력


// 4. 배열 반복
// 배열 반복 (for문)
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

// 배열 반복 (forEach 메서드)
fruits.forEach(function (fruit) {
    console.log(fruit);
});

fruits.forEach((fruit) => {
    console.log(fruit);
});


// 5. 배열 메서드 활용
// 배열 메서드 활용
numbers.push(6); // 배열 끝에 요소 추가
console.log(numbers); // 요소가 추가된 배열 출력

const removedItem = numbers.pop(); // 배열 끝의 요소 제거
console.log(removedItem); // 제거된 요소 출력
console.log(numbers); // 요소가 제거된 배열 출력

// slice() 메서드는 기존 배열의 일부를 선택하여 새로운 배열을 반환합니다. 
// 이 메서드는 원본 배열을 변경하지 않고 원하는 부분을 복사합니다.
const slicedArray = fruits.slice(1, 3); // 배열 잘라내기 (1부터 3전까지)
console.log(slicedArray); // 잘라낸 배열 출력
console.log(fruits); // 원본 배열 출력

// splice() 메서드는 배열에서 요소를 제거하거나 새 요소를 추가하여 원본 배열을 수정합니다.
const removedElements = numbers.splice(1,2);
console.log(removedElements); // [2, 3]
console.log(numbers); // [1, 4, 5] (수정된 원본 배열)


// 연산자를 사용한 배열 병합
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];

// concat() 메서드를 사용한 배열 병합
const mergedArray = array1.concat(array2);
console.log(mergedArray); // [1, 2, 3, 4, 5, 6]

// Spread 문법을 사용한 배열 병합
const mergedArrayWithSpread = [...array1, ...array2];
console.log(mergedArrayWithSpread); // [1, 2, 3, 4, 5, 6]


// splice 를 사용한 배열 중간에 삽입
const originalArray = [1, 2, 3];
const elementsToInsert = [4, 5, 6];

originalArray.splice(1, 0, ...elementsToInsert); // 1번 인덱스에 elementsToInsert를 추가 (0개 제거)
console.log(originalArray); // [1, 4, 5, 6, 2, 3]

