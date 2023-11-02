// map() 함수는 배열의 각 요소에 대해 주어진 콜백 함수를 호출하여 새로운 배열을 생성합니다.
// 기존 배열의 각 요소를 변환하여 새로운 배열을 반환합니다.

const numbers = [1, 2, 3, 4, 5];
const squaredNumbers = numbers.map((num) => num * num);
console.log(squaredNumbers);
// 출력: [1, 4, 9, 16, 25]


// 참고
function squareNumber(num) {
    return num * num;
}

const sqrNumbers = numbers.map(squareNumber);
