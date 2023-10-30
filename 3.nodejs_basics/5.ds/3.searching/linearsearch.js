function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // 찾는 요소의 인덱스 반환
        }
    }
    return -1; // 요소를 찾지 못한 경우 -1 반환
}

// 예시 배열
const array = [4, 2, 7, 1, 9, 5];

// 7을 찾는 경우
console.log(linearSearch(array, 7)); // 결과: 2 (7은 인덱스 2에 위치함)

// 3을 찾는 경우 (없는 경우)
console.log(linearSearch(array, 3)); // 결과: -1 (3은 배열에 없음)
