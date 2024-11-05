// curl 127.0.0.1:3000/ -c cookie.txt --cookie cookie.txt
// curl 127.0.0.1:3000/api/data -c cookie.txt --cookie cookie.txt

const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const app = express();
const port = 3000;

const secretKey = 'yourSecretKey'; // JWT 서명을 위한 시크릿 키

app.use(cookieParser());
app.use(morgan('dev'));

app.use((req, res, next) => {
    // 클라이언트에게 JWT 생성 및 전송
    const clientId = 'uniqueClientId'; // 클라이언트의 고유 식별자
    const token = jwt.sign({ clientId }, secretKey, { expiresIn: '1h' });

    // 클라이언트에게 JWT를 쿠키에 저장하거나 응답 헤더에 넣어 전달
    res.cookie('jwt', token, { httpOnly: true });

    // 다음 미들웨어로 이동
    next();
});

app.get('/', (req, res) => {
    res.send('Hello, this is the root path!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
