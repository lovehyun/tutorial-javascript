function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}

async function asyncCall() {
    console.log('비동기 시작');

    try {
        const result = await resolveAfter2Seconds();
        console.log(result);
    } catch (error) {
        console.error('에러 발생:', error);
    }

    console.log('비동기 끝');
}

console.log('The Start');
// asyncCall();
console.log('The End');


// ----------------------------------
// 이전 콜백헬의 Promise/async/await 를 사용한 해결 (입력 인자 추가)
// ----------------------------------
function asyncOperation3(input) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = input + 1;
            console.log(`Operation 3 completed with input:${input}, result:${result}`);
            resolve(result);
        }, 1000);
    });
}

function asyncOperation4(input) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = input + 2;
            console.log(`Operation 4 completed with input:${input}, result:${result}`);
            resolve(result);
        }, 1000);
    });
}

async function executeOperations2() {
    try {
        let input = 0;

        const response1 = await asyncOperation3(input);
        const response2 = await asyncOperation4(response1);
        const response3 = await asyncOperation3(response2);
        const response4 = await asyncOperation4(response3);

        console.log('Final response:', response4);
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

executeOperations2();
