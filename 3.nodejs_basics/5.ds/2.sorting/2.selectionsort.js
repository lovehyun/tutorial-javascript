function selectionSort(arr) {
    const length = arr.length;

    for (let i = 0; i < length - 1; i++) {
        let minIndex = i;

        // i부터 배열의 끝까지 최소값을 찾음
        for (let j = i + 1; j < length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        // 최소값을 현재 위치로 교환
        if (minIndex !== i) {
            const temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }

    return arr;
}

// 사용 예시
const array = [64, 25, 12, 22, 11];
console.log('정렬 전:', array);
const sortedArray = selectionSort(array);
console.log('정렬 후:', sortedArray);
