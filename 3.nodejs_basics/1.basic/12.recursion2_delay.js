// 1. 팩토리얼 계산
function factorial(n) {
    return new Promise((resolve) => {
        if (n <= 1) {
            resolve(1); // 종료 조건
        } else {
            setTimeout(async () => {
                const result = n * await factorial(n - 1); // 재귀 호출과 딜레이
                resolve(result);
            }, 500); // 500ms 딜레이
        }
    });
}

console.time('[Time] factorial');
factorial(5).then(result => {
    console.log(`Factorial: ${result}`); // 결과: 120
    console.timeEnd('[Time] factorial');
});


// 2. 피보나치 수열
function fibonacci(n) {
    return new Promise((resolve) => {
        if (n <= 1) {
            resolve(n); // 종료 조건
        } else {
            setTimeout(async () => {
                const result = await fibonacci(n - 1) + await fibonacci(n - 2); // 재귀 호출과 딜레이
                resolve(result);
            }, 500); // 500ms 딜레이
        }
    });
}

console.time('[Time] fibonacci');
fibonacci(6).then(result => {
    console.log(`Fibonacci: ${result}`); // 결과: 8
    console.timeEnd('[Time] fibonacci');
});


// 3. 숫자의 합 구하기
function sum(n) {
    return new Promise((resolve) => {
        if (n <= 1) {
            resolve(n); // 종료 조건
        } else {
            setTimeout(async () => {
                const result = n + await sum(n - 1); // 재귀 호출과 딜레이
                resolve(result);
            }, 500); // 500ms 딜레이
        }
    });
}

console.time('[Time] sum');
sum(5).then(result => {
    console.log(`Sum: ${result}`); // 결과: 15
    console.timeEnd('[Time] sum');
});
