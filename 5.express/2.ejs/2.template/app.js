// npm install ejs
const express = require('express');
const app = express();

// EJS를 뷰 엔진으로 설정
app.set('view engine', 'ejs');

// <%= 변수명 %>
// <%# 주석 %>
// <% 로직 %>

app.get('/', (req, res) => {
    res.render('index', { title: 'Express 앱', message: 'EJS를 사용 중입니다.' });
});

app.get('/fruits', (req, res) => {
    const fruits = ['Apple', 'Banana', 'Orange', 'Grapes'];
    res.render('fruits', { fruits: fruits });
});

app.get('/greeting', (req, res) => {
    const username = 'John Doe'; // 실제로는 데이터베이스에서 사용자 이름을 가져오거나 다른 방식으로 동적으로 생성할 수 있습니다.
    res.render('greeting', { username }); // 축약 문법
});

app.get('/welcome', (req, res) => {
    const isAdmin = true; // 실제로는 사용자의 권한에 따라 동적으로 결정할 수 있습니다.
    res.render('welcome', { isAdmin: isAdmin });
});

const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
