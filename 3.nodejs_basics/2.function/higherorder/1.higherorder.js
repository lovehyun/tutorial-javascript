// 고차 함수(higher-order function)는 다른 함수를 인자로 받거나 함수를 반환하는 함수를 가리킵니다. JavaScript는 함수를 first-class citizens(일급 시민)으로 취급하기 때문에 고차 함수를 지원합니다.
// 고차 함수의 주요 특징은 다음과 같습니다:
// 함수를 매개변수로 전달: 고차 함수는 다른 함수를 매개변수로 받을 수 있습니다. 이는 콜백 함수(callback)나 다른 함수를 내부적으로 실행할 때 활용됩니다.
// 함수를 반환: 고차 함수는 다른 함수를 반환할 수 있습니다. 일반적으로 이는 클로저(closure)를 생성하거나 다른 함수에 대한 팩토리(factory)로 사용될 수 있습니다.

// 함수를 인자로 받는 고차 함수
function doSomething(func) {
    console.log('무언가를 수행합니다.');
    func(); // 인자로 받은 함수 실행
}

function sayHello() {
    console.log('안녕하세요!');
}

doSomething(sayHello); // sayHello 함수를 doSomething 함수의 인자로 전달

// 함수를 반환하는 고차 함수
function createMultiplier(multiplier) {
    return function (x) {
        return x * multiplier;
    };
}

const double = createMultiplier(2);
console.log(double(5)); // 출력: 10
