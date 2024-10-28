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
