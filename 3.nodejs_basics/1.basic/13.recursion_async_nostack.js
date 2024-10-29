function asyncRecursive(n) {
    return new Promise((resolve) => {
        if (n <= 0) {
            resolve("Done");
        } else {
            console.log(`Processing: ${n}`);
            setTimeout(() => {
                asyncRecursive(n - 1).then(resolve); // 비동기 재귀 호출
            }, 500);
        }
    });
}

asyncRecursive(5).then(console.log);
