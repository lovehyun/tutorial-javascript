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

const slicedArray = fruits.slice(1, 3); // 배열 잘라내기
console.log(slicedArray); // 잘라낸 배열 출력
