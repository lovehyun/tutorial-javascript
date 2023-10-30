// 이진 검색 함수
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid; // 찾는 요소의 인덱스 반환
        } else if (arr[mid] < target) {
            left = mid + 1; // 중간 값보다 큰 부분 탐색
        } else {
            right = mid - 1; // 중간 값보다 작은 부분 탐색
        }
    }

    return -1; // 요소를 찾지 못한 경우 -1 반환
}

// 10만개의 랜덤 숫자 생성
const randomArray = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100000)).sort((a, b) => a - b);

// 찾을 숫자
// const targetNumber = randomArray[Math.floor(Math.random() * randomArray.length)];
const targetNumber = 88888;

// 이진 검색 소요시간 측정
console.time('binarySearch');
const result = binarySearch(randomArray, targetNumber);
console.timeEnd('binarySearch');

if (result !== -1) {
    console.log(`찾는 숫자 ${targetNumber}은 배열의 인덱스 ${result}에 있습니다.`);
} else {
    console.log(`배열에서 숫자를 찾을 수 없습니다.`);
}
