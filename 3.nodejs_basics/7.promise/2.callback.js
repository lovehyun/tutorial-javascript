// 1. 콜백 예제
function greet(name, callback) {
    const message = `안녕, ${name}!`;
    callback(message);
}

function displayGreeting(greeting) {
    console.log(greeting);
    // console.log(`<H1>${greeting}</H1>`);
    // console.log(`<LI>${greeting}</LI>`);
}

// greet 함수 호출 후 displayGreeting 함수를 콜백으로 전달
greet('홍길동', displayGreeting);



// 2. 콜백 예제2
function add(a, b, callback) {
    const sum = a + b;
    callback(sum);
}

function displayResult(result) {
    console.log('결과:', result);
    // console.log('Result: ', result);
}

// add 함수 호출 후 displayResult 함수를 콜백으로 전달
add(5, 3, displayResult);


// 3. 콜백 예제2-3
function add(a, b, callback) {
    const sum = a + b;
    callback(a, b, sum);
}

function displayResult2(a, b, result) {
    console.log(`${a} 와 ${b} 의 합산 결과: ${result}`);
}

// add 함수 호출 후 displayResult 함수를 콜백으로 전달
add(5, 3, displayResult);



// 4. 콜백 예제3 (비동기)
// 비동기적으로 더하기 함수
function addAsync(a, b, callback) {
    setTimeout(() => {
        const result = a + b;
        callback(result);
    }, 1000); // 1초 뒤에 실행
}

// 콜백 함수
function callbackFunction(result) {
    console.log('결과는:', result);
}

// 함수 호출
addAsync(5, 10, callbackFunction);
console.log("함수 호출 후"); // 이 줄은 비동기 함수 호출과 동시에 실행됨
