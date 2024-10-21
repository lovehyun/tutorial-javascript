// reduce() 함수는 배열의 각 요소에 대해 주어진 콜백 함수를 실행하여 하나의 값으로 축소합니다.
// 초기값(또는 누산기)과 배열의 각 요소를 사용하여 단일 값으로 줄여나갑니다.

// 1. 배열의 합산 구하기 (reduce의 맨 뒤 인자 ,0 은 초기값)
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum);  // 출력: 15


// 2. 배열의 곱 합산 구하기 (맨 뒤 ,1 은 초기값)
const product = numbers.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
console.log(product);  // 출력: 120


// 3. 배열의 최대값 찾기
const numbers2 = [10, 5, 20, 8, 15];
const max = numbers2.reduce((accumulator, currentValue) => {
    return currentValue > accumulator ? currentValue : accumulator;
}, numbers2[0]);
console.log(max);  // 출력: 20

// 참고1.
// const max = numbers2.reduce((accumulator, currentValue) => currentValue > accumulator ? currentValue : accumulator, numbers2[0]);

// 참고2.
// const max = Math.max(...numbers);

// 참고3.
// function my_max(numbers) {
//     let max = numbers[0]; // 첫 번째 요소를 초기 최대값으로 설정
//
//     for (let i = 1; i < numbers.length; i++) {
//         if (numbers[i] > max) {
//             max = numbers[i];
//         }
//     }
//
//     return max;
// }


// 4. 배열의 최소값 찾기
const min = numbers2.reduce((accumulator, currentValue) => {
    return currentValue < accumulator ? currentValue : accumulator;
}, numbers[0]);
console.log(min);  // 출력: 5


// 5. 배열의 평균값 구하기
const numbers3 = [10, 20, 30, 40, 50];

// accumulator: 이전 단계까지의 누적 값. (초기값이 설정되면 그 값을 기준으로 시작)
// currentValue: 현재 처리 중인 배열 요소.
// index: 현재 배열 요소의 인덱스 (0부터 시작).
// array: reduce()가 호출된 배열 자체.

const average = numbers3.reduce((accumulator, currentValue, index, array) => {
    accumulator += currentValue;
    if (index === array.length - 1) {
        return accumulator / array.length;
    }
    return accumulator;
}, 0);
console.log(average);  // 출력: 30

const sum3 = numbers3.map(num => num).reduce((acc, curr) => acc + curr, 0);
const average3 = sum3 / numbers3.length;
console.log(average3);  // 출력: 30


// 6. 객체 배열에서 특정 속성의 합계 구하기
const items = [
    { name: "Apple", price: 100 },
    { name: "Banana", price: 50 },
    { name: "Cherry", price: 75 }
];

const totalPrice = items.reduce((accumulator, item) => accumulator + item.price, 0);
console.log(totalPrice);  // 출력: 225

