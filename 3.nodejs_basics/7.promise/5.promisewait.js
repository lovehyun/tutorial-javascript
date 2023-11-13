// -------------------------
// 예제1. 이전의 Promise 코드를 async/await를 통해서 해결
// -------------------------
function asyncOperation1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Operation 1 completed');
            resolve('Response 1');
        }, 1000);
    });
}

function asyncOperation2(response) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Operation 2 completed with', response);
            resolve('Response 2');
        }, 1000);
    });
}

async function executeOperations() {
    try {
        const response1 = await asyncOperation1(null);
        const response2 = await asyncOperation2(response1);
        const response3 = await asyncOperation1(response2);
        const response4 = await asyncOperation2(response3);

        console.log('Final response:', response4);
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

// executeOperations();


// -------------------------
// 예제2. 대기 및 재시도 코드
// -------------------------
async function waitForResult(retryCount = 0) {
    try {
        const result = await getAsyncResult();
        console.log("결과 도착:", result);
        return result;
        // 여기에서 추가 작업을 수행하거나 프로세스를 종료할 수 있음
    } catch (error) {
        console.error("에러 발생:", error);
        // console.log("결과가 도착하지 않았으므로 재시도...");
        // return new Promise(waitForResult, 1000); // 재시도를 위해 setTimeout 사용

        console.log(`결과가 도착하지 않았으므로 재시도 ${retryCount + 1}...`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(waitForResult(retryCount + 1));
            }, 1000);
        });
    }
}

function getAsyncResult() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const resultArrived = Math.random() >= 0.8;

            if (resultArrived) {
                resolve("외부 API로부터 받은 결과");
            } else {
                // reject(new Error("결과가 아직 도착하지 않았습니다."));
                reject("결과가 아직 도착하지 않았습니다.")
            }
        }, 2000);
    });
}

// 초기 실행
// result = waitForResult();
// console.log("최종 비동기 결과: ", result);

waitForResult().then((finalResult) => {
    console.log("최종 비동기 결과: ", finalResult);
});
