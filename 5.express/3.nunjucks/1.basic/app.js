// npm install nunjucks
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

// 뷰엔진에서 읽을 기본 확장자 정의 (.njk, .html 등)
// app.set('view engine', 'njk');

// Nunjucks를 뷰 엔진으로 설정
nunjucks.configure('views', {
    autoescape: true, // 입력값 문자열 이스케이핑을 자동으로 추가해서, XSS 등에 자동 대응 (기본값: true)
    express: app,
    watch: true // 템플릿 파일의 변경 사항을 자동 감지
});

app.get('/', (req, res) => {
    // 기본값은 njk (이때는 위 뷰엔진 설정 해주어야 함)
    // res.render('index', { title: 'Express 앱', message: 'Nunjucks를 사용 중입니다.' });
    res.render('index.html', { title: 'Express 앱', message: 'Nunjucks를 사용 중입니다.' });
});

const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
