// 구현방식1
function bubbleSort(arr) {
    const length = arr.length;

    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 두 요소를 교환
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return arr;
}

// 사용 예시
const array = [64, 34, 25, 12, 22, 11, 90];
console.log('정렬 전:', array);
const sortedArray = bubbleSort(array);
console.log('정렬 후:', sortedArray);


// 구현방식2
function bubbleSort2(arr) {
    const len = arr.length;
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < len - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                const temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    return arr;
}

// 사용 예시
const array2 = [64, 25, 12, 22, 11];
console.log('정렬 전:', array);
const sortedArray2 = bubbleSort2(array);
console.log('정렬 후:', sortedArray);
