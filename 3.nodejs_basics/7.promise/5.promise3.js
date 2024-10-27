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


// 예제2.
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
