// myapp 객체 생성
const myapp = {
    middlewares: [],

    // 미들웨어 등록 메서드
    register(fn) {
        this.middlewares.push(fn);
    },

    // 미들웨어 순차적으로 실행
    run(context) {
        for (let fn of this.middlewares) {
            fn(context);
        }
    }
};

// 미들웨어 함수 예제
function middleware1(context) {
    console.log("Middleware 1 실행");
    context.step1 = "done";
}

function middleware2(context) {
    console.log("Middleware 2 실행");
    context.step2 = "done";
}

function middleware3(context) {
    console.log("Middleware 3 실행");
    context.step3 = "done";
}

// 미들웨어 등록
myapp.register(middleware1);
myapp.register(middleware2);
myapp.register(middleware3);

// 실행할 때 사용할 context 객체
const context = {};

// 미들웨어 순차적으로 실행
myapp.run(context);

// 실행 결과 확인
console.log("Context 상태:", context);
