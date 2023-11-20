const express = require('express');
const nunjucks = require('nunjucks');
const app = express();

// Nunjucks를 뷰 엔진으로 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

// app.set('view engine', 'njk');
app.set('view engine', 'html');
// app.set('views', __dirname + '/your_custom_directory');

app.get('/', (req, res) => {
    res.render('index', { title: 'Express 앱', message: 'Nunjucks를 사용 중입니다.' });
});

app.get('/fruits', (req, res) => {
    const fruits = ['Apple', 'Banana', 'Orange', 'Grapes'];
    res.render('fruits', { fruits: fruits });
});

app.get('/greeting', (req, res) => {
    const username = 'John Doe';
    res.render('greeting', { username: username });
});

app.get('/welcome', (req, res) => {
    const isAdmin = true;
    res.render('welcome', { isAdmin: isAdmin });
});

const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
