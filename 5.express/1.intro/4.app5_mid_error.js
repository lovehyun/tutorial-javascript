const express = require('express');
const app = express();
const port = 3000;

// Express에서 에러 처리 미들웨어는 다른 미들웨어와 유사하지만, 함수의 인자가 4개(err, req, res, next)인 점에서 차이가 있습니다. 
// 이 에러 처리 미들웨어는 주로 app.use()를 사용해 정의하고, 모든 라우트 정의 마지막에 추가합니다.

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 예제 라우트에서 오류를 발생시키는 코드
app.get('/error', (req, res) => {
    throw new Error('이 페이지에서 오류가 발생했습니다!');
});

async function someAsyncFunction() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                reject(new Error('비동기 작업 중 에러가 발생했습니다!'));
            } else {
                resolve('비동기 작업 성공');
            }
        }, 1000); // 1초 후에 작업 완료
    });
}

// 예제 라우트에서 비동기 처리 함수 내에서 오류 발생 시 명시적으로 next() 호출해서 전달해야 함
app.get('/async-error', async (req, res, next) => {
    try {
        await someAsyncFunction();
        res.send('완료');
    } catch (err) {
        next(err); // 명시적으로 에러를 전달
    }
});

// 에러 처리 미들웨어
// 404 처리 (맨 마지막에 추가해서 next() 호출 불필요)
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// 에러 처리 미들웨어 - 오류코드에 따라
app.use((err, req, res, next) => {
    console.error('에러 발생:', err.message); // 콘솔에 에러 로그
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' }); // 클라이언트에 응답
});

// 추가 라우트 (실행되지 않음)
// /test 경로를 요청하면 404 미들웨어가 먼저 실행되기 때문에 해당 라우트에 도달하지 못하게 됩니다.
app.get('/test', (req, res) => {
    res.send('Test route');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
