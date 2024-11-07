const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const port = 3000;

// Nunjucks를 뷰 엔진으로 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html'); // 확장자를 .html로 설정

// 루트 경로에 대한 라우트
app.get('/page', (req, res) => {
    const data = {
        title: 'My Page',
        content: 'This is the content of my page.',
    };
    res.render('page', data);
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
