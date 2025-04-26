const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

// POST 요청 데이터 읽을 수 있게 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// 서버 대기 함수 (ms 단위)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '3.advanced.html'));
});

// 실제 API 엔드포인트

// 로그인 입력 처리
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('로그인 요청:', { email, password });

    // 2초 동안 일부러 대기
    await sleep(2000);

    res.json({ message: '로그인 정보를 받았습니다!' });
});

// 이름 입력 처리
app.post('/api/send-name', async (req, res) => {
    const { name } = req.body;

    console.log('받은 이름:', name);

    // 2초 동안 일부러 대기
    await sleep(2000);

    // 성공 응답 보내기
    res.json({ message: `서버에 ${name} 이름을 성공적으로 저장했습니다!` });
});

// 타이머 완료 처리
app.post('/api/timer-done', async (req, res) => {
    console.log('타이머 완료 요청 수신');

    await sleep(2000);
    res.json({ message: '타이머 완료 메시지를 받았습니다!' });
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
