function delayedSquare(index) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(index * index);
        }, 1000); // 1초 대기
    });
}

async function sequentialExecution() {
    const results = [];
    for (let i = 0; i < 10; i++) {
        const result = await delayedSquare(i); // 순차적으로 실행
        results.push(result);
    }
    console.log("Sequential Results:", results);
}

async function parallelExecution() {
    const promises = [];
    for (let i = 0; i < 10; i++) {
        promises.push(delayedSquare(i)); // 모든 함수를 동시에 실행
    }
    const results = await Promise.all(promises); // 병렬 실행 결과 기다리기
    console.log("Parallel Results:", results);
}

// 함수 호출 시 시간 측정
console.time("Sequential Execution Time");
sequentialExecution().then(() => {
    console.timeEnd("Sequential Execution Time");
});

// 함수 호출 시 시간 측정
console.time("Parallel Execution Time");
parallelExecution().then(() => {
    console.timeEnd("Parallel Execution Time");
});
