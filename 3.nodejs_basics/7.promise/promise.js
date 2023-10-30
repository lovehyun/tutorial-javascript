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


// 예제1.
function performTask() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const randomNumber = Math.random();
            if (randomNumber >= 0.5) {
                resolve('작업이 완료되었습니다.');
            } else {
                reject('작업 실패');
            }
        }, 2000); // 2초의 지연 후 작업 완료 또는 실패
    });
}

// Promise 사용
performTask()
    .then((result) => {
        console.log('성공:', result);
    })
    .catch((error) => {
        console.error('실패:', error);
    });


// 예제2
function fetchData(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    resolve(response.json()); // 성공 시 결과를 resolve하여 알림
                } else {
                    reject('네트워크 오류: ' + response.status); // 오류 시 reject하여 실패를 알림
                }
            })
            .catch((error) => reject('네트워크 요청 실패:', error)); // 요청 실패 시 reject하여 실패를 알림
    });
}

// fetchData를 사용하여 네트워크 요청을 보냄
fetchData('https://jsonplaceholder.typicode.com/posts/1')
    .then((data) => {
        console.log('데이터:', data);
    })
    .catch((error) => {
        console.error('에러 발생:', error);
    });


// ----------------------------------
// 이전 콜백헬의 Promise 를 사용한 해결
// ----------------------------------
function asyncOperation1() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log('Operation 1 completed');
            resolve('Response 1');
        }, 1000);
    });
}

function asyncOperation2(response) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log('Operation 2 completed with', response);
            resolve('Response 2');
        }, 1000);
    });
}

// Promise를 연결하여 콜백 헬을 해결함
asyncOperation1()
    .then(response1 => asyncOperation2(response1))
    .then(response2 => asyncOperation1(response2))
    .then(response3 => asyncOperation2(response3))
    .then(response4 => {
        console.log('Final response:', response4);
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });

    function asyncOperation1() {
        return new Promise((resolve) => {
            setTimeout(function () {
                console.log('Operation 1 completed');
                resolve('Response 1');
            }, 1000);
        });
    }
    
    function asyncOperation2(response) {
        return new Promise((resolve) => {
            setTimeout(function () {
                console.log('Operation 2 completed with', response);
                resolve('Response 2');
            }, 1000);
        });
    }
    
    async function executeOperations() {
        try {
            const response1 = await asyncOperation1();
            const response2 = await asyncOperation2(response1);
            const response3 = await asyncOperation1(response2);
            const response4 = await asyncOperation2(response3);
    
            console.log('Final response:', response4);
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }
    
    executeOperations();
    