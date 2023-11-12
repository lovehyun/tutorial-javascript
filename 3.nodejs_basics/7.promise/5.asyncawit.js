function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}

async function asyncCall() {
    console.log('시작');

    try {
        const result = await resolveAfter2Seconds();
        console.log(result);
    } catch (error) {
        console.error('에러 발생:', error);
    }

    console.log('끝');
}

asyncCall();
console.log('The End');


// ----------------------------------
// 이전 콜백헬의 Promise/async/awit 를 사용한 해결
// ----------------------------------
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
