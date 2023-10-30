function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    } else {
        const pivot = arr[arr.length - 1];
        const left = [];
        const right = [];

        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }

        return [...quickSort(left), pivot, ...quickSort(right)];
    }
}

// 사용 예시
const array = [29, 10, 14, 37, 13];
console.log('정렬 전:', array);
const sortedArray = quickSort(array);
console.log('정렬 후:', sortedArray);
