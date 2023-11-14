const express = require('express');
const nunjucks = require('nunjucks');
const app = express();

// Nunjucks를 뷰 엔진으로 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
    res.render('index.html', { title: 'Express 앱', message: 'Nunjucks를 사용 중입니다.' });
});

app.get('/fruits', (req, res) => {
    const fruits = ['Apple', 'Banana', 'Orange', 'Grapes'];
    res.render('fruits.html', { fruits: fruits });
});

app.get('/greeting', (req, res) => {
    const username = 'John Doe';
    res.render('greeting.html', { username: username });
});

app.get('/welcome', (req, res) => {
    const isAdmin = true;
    res.render('welcome.html', { isAdmin: isAdmin });
});

const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
