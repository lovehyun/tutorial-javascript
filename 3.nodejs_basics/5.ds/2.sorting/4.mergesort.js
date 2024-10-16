// 첫 번째 코드에서 merge 함수는 left와 right 배열을 비교하여 정렬된 배열을 생성합니다. 
// 그리고 mergeSort 함수는 주어진 배열을 반으로 분할하고 재귀적으로 배열을 정렬하면서 병합합니다.

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // 두 배열을 비교하여 정렬된 배열 생성
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    // 남은 요소들 처리
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function mergeSort(arr) {
    const length = arr.length;

    // 배열이 1개 이하일 경우 정렬 완료
    if (length <= 1) {
        return arr;
    }

    // 배열을 반으로 분할
    const middle = Math.floor(length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    // 분할된 배열을 병합
    return merge(mergeSort(left), mergeSort(right));
}

// 사용 예시
const array = [38, 27, 43, 3, 9, 82, 10];
console.log('정렬 전:', array);
const sortedArray = mergeSort(array);
console.log('정렬 후:', sortedArray);
