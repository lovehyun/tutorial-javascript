// 1. 타임아웃 성공 예제
function performAsyncTask(callback) {
    setTimeout(() => {
        const randomNumber = Math.random();
        if (randomNumber >= 0.5) {
            callback(null, '작업이 완료되었습니다.');
        } else {
            callback('작업 실패', null);
        }
    }, 2000); // 2초의 지연 후 작업 완료 또는 실패
}

// 비동기 작업 시작
performAsyncTask((error, result) => {
    if (error) {
        console.error('실패:', error);
    } else {
        console.log('성공:', result);
    }
});


// 2. 실패 시뮬레이션
function performAsyncTask2(shouldSucceed, callback) {
    setTimeout(() => {
        if (shouldSucceed) {
            callback(null, '작업이 완료되었습니다.');
        } else {
            callback('작업 실패', null);
        }
    }, 2000); // 2초의 지연 후 작업 완료 또는 실패
}

// 테스트: 성공
performAsyncTask2(true, (error, result) => {
    if (error) {
        console.error('실패:', error);
    } else {
        console.log('성공:', result);
    }
});

// 테스트: 실패
performAsyncTask2(false, (error, result) => {
    if (error) {
        console.error('실패:', error);
    } else {
        console.log('성공:', result);
    }
});
