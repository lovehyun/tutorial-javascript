// reduce() 함수는 배열의 각 요소에 대해 주어진 콜백 함수를 실행하여 하나의 값으로 축소합니다.
// 초기값(또는 누산기)과 배열의 각 요소를 사용하여 단일 값으로 줄여나갑니다.

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum);
// 출력: 15
