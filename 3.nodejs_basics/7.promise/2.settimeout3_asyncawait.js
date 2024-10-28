console.log("0. 타이머에 의한 비동기처리 시작.");

function setTimeoutSync(message, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(message);
            resolve();
        }, delay);
    });
}

async function executeTasks() {
    await setTimeoutSync("1. 첫번째 작업: 1초후 실행", 1000);
    await setTimeoutSync("2. 두번째 작업: 2초후 실행", 1000);
    await setTimeoutSync("3. 세번째 작업: 3초후 실행", 1000);
    console.log("4. 모든 작업이 완료되었습니다.");
}

executeTasks();
