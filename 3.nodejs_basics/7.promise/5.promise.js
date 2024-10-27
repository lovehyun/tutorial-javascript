// 대기(Pending): 비동기 작업이 아직 완료되지 않은 초기 상태입니다.
// 이행(Fulfilled): 비동기 작업이 성공적으로 완료된 상태를 나타냅니다.
// 거부(Rejected): 비동기 작업이 실패한 상태를 나타냅니다.

const myPromise = new Promise((resolve, reject) => {
    // 비동기 작업 수행
    // 작업이 완료되면 resolve() 호출하여 성공을 알림
    // 작업이 실패하면 reject() 호출하여 실패를 알림
});

// Promise 사용
myPromise
    .then((result) => {
        // 성공했을 때의 처리
    })
    .catch((error) => {
        // 실패했을 때의 처리
    });


// Promise를 사용한 비동기 처리 예제
function generateRandomNumber() {
    return new Promise((resolve, reject) => {
        console.log("랜덤 숫자를 생성 중...");

        setTimeout(() => {
            const randomNumber = Math.random();
            console.log("생성된 숫자:", randomNumber);

            if (randomNumber >= 0.5) {
                resolve(`성공! 숫자 ${randomNumber}가 0.5 이상입니다.`);
            } else {
                reject(`실패! 숫자 ${randomNumber}가 0.5 미만입니다.`);
            }
        }, 1000);
    });
}

// Promise 사용 예제
generateRandomNumber()
    .then((message) => {
        console.log("이행됨:", message);
    })
    .catch((error) => {
        console.error("실패:", error);
    });
