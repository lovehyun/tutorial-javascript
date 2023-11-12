// 1. 비동기 코드 바로 실행
// 비동기적으로 실행하는 함수
// 간단한 콜백 함수
function sayHello() {
    console.log('안녕하세요! 이것은 콜백 함수입니다.');
}
  
// setTimeout() 함수를 사용하여 2초 후에 콜백 함수 실행
setTimeout(sayHello, 2000);

// 바로 실행하는 코드
setTimeout(() => {
    console.log("비동기 코드가 실행됨");
}, 0);

console.log("함수 호출 후"); // 이 줄은 비동기 함수 호출과 동시에 실행됨


// 2. 타임아웃 성공 예제
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


// 3. 실패 시뮬레이션
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
