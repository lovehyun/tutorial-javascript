const EventEmitter = require('events');

// 새로운 이벤트 생성
const myEmitter = new EventEmitter();

// 비동기적으로 실행하는 함수
function performAsyncTask() {
    // 작업이 완료되면 'done' 이벤트 발생
    setTimeout(() => {
        myEmitter.emit('done', '작업 완료!');
    }, 1000);
}

// 이벤트 핸들링
myEmitter.on('done', (message) => {
    console.log(message);
});

// 함수 호출
performAsyncTask();
console.log('함수 호출 후'); // 이 줄은 비동기 함수 호출과 동시에 실행됨
