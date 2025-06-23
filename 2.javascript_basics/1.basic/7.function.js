// 6. 함수

// 기본 함수
function greet(name) {
    console.log("Hello, " + name);
}
greet("John");

// return 함수
function add(a, b) {
    return a + b;
}
console.log(add(3, 5));

// 함수 표현식
const multiply = function(x, y) {
    return x * y;
};
console.log(multiply(4, 5));

// 화살표 함수
const divide = (x, y) => x / y;
console.log(divide(10, 2));
