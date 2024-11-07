const express = require('express');
const ejs = require('ejs');

const app = express();
const port = 3000;

// 뷰엔진에서 읽을 기본 확장자 정의
app.set('view engine', 'ejs');

app.get('/page', (req, res) => {
    const data = {
        title: 'My Page',
        content: 'This is the content of my page.',
    };
    res.render('main', data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
