// 두 번째 코드는 merge 함수 또한 비슷한 방식으로 두 배열을 비교하고 병합하지만, 
// mergeSort 함수는 slice를 사용하여 배열을 분할하고 병합할 때에 재귀적으로 merge 함수를 호출하여 정렬합니다.

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    // 남은 요소들 추가
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function mergeSort(arr) {
    const length = arr.length;

    if (length <= 1) {
        return arr;
    }

    const middle = Math.floor(length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}

// 사용 예시
const array = [64, 25, 12, 22, 11];
console.log('정렬 전:', array);
const sortedArray = mergeSort(array);
console.log('정렬 후:', sortedArray);
