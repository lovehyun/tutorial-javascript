const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cookieParser());

app.get('/', (req, res) => {
    // 쿠키 생성 및 전송
    res.cookie('exampleCookie', 'Hello, HttpOnly Cookie!', { httpOnly: true });
    // res.send('Cookie has been set!');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
