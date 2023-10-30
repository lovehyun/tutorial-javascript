/*
// 콜백헬 개념
doSomething(function (result) {
    doSomethingElse(result, function (newResult) {
        doAnotherThing(newResult, function (finalResult) {
            // 계속해서 콜백 함수가 중첩됨
        });
    });
});

// 대응법
doSomething()
    .then((result) => {
        return doSomethingElse(result);
    })
    .then((newResult) => {
        return doAnotherThing(newResult);
    })
    .then((finalResult) => {
        // 연쇄적으로 처리하는 Promise
    })
    .catch((error) => {
        // 에러 처리
    });
*/

// 콜백헬 예제
// asyncOperation1(function (response1) {
//     asyncOperation2(response1, function (response2) {
//         asyncOperation3(response2, function (response3) {
//             asyncOperation4(response3, function (response4) {
//                 // ... 계속해서 콜백 함수가 중첩됨
//             });
//         });
//     });
// });

function asyncOperation1(response, callback) {
    setTimeout(function () {
        console.log('Operation 1 completed');
        callback('Response 1');
    }, 1000);
}

function asyncOperation2(response, callback) {
    setTimeout(function () {
        console.log('Operation 2 completed with', response);
        callback('Response 2');
    }, 1000);
}

// 콜백 헬
asyncOperation1(null, function (response1) {
    asyncOperation2(response1, function (response2) {
        asyncOperation1(response2, function (response3) {
            asyncOperation2(response3, function (response4) {
                console.log('Final response:', response4);
            });
        });
    });
});
