// 1. 콜백 예제
function greet(name, callback) {
    const message = `안녕, ${name}!`;
    callback(message);
}

function displayGreeting(greeting) {
    console.log(greeting);
}

// greet 함수 호출 후 displayGreeting 함수를 콜백으로 전달
greet('예제', displayGreeting);


// 2. 콜백 예제2
function add(a, b, callback) {
    const sum = a + b;
    callback(sum);
}

function displayResult(result) {
    console.log('결과:', result);
}

// add 함수 호출 후 displayResult 함수를 콜백으로 전달
add(5, 3, displayResult);
