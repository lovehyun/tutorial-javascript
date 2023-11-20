// npm install nunjucks
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();

// app.set('view engine', 'njk');

// Nunjucks를 뷰 엔진으로 설정
nunjucks.configure('views', {
    autoescape: true, // 입력값 문자열 이스케이핑을 자동으로 추가해서, XSS 등에 자동 대응 (기본값: true)
    express: app
});

app.get('/', (req, res) => {
    // 기본값은 njk
    // res.render('index', { title: 'Express 앱', message: 'Nunjucks를 사용 중입니다.' });
    res.render('index.html', { title: 'Express 앱', message: 'Nunjucks를 사용 중입니다.' });
});

const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
