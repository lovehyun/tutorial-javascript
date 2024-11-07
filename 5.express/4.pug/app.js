// npm install pug
const express = require('express');
const app = express();

// Pug를 뷰 엔진으로 설정
app.set('view engine', 'pug');
app.set('views', './views'); // 뷰 파일 경로 설정

app.get('/', (req, res) => {
    res.render('index', { title: 'Express 앱', message: 'Pug를 사용 중입니다.' });
});

app.get('/detail', (req, res) => {
    const user = { name: '홍길동' };
    const articles = [
        { title: '첫 번째 기사', content: '첫 번째 기사 내용입니다.' },
        { title: '두 번째 기사', content: '두 번째 기사 내용입니다.' },
        { title: '세 번째 기사', content: '세 번째 기사 내용입니다.' },
    ];

    res.render('index', { user, articles });
});

const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
