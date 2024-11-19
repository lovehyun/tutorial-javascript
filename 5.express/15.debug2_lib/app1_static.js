const express = require('express');
const { debugS, debugU, debugR } = require('./debug_static');

const app = express();
const port = 3000;

setupDebugMiddleware(app);

app.use((req, res, next) => {
    debugR('Request: ', req.url);
    next();
});

app.get('/', (req, res) => {
    res.send('root');
});

app.get('/upload', (req, res) => {
    const { key } = req.query;

    debugU('upload 기능 요청: ', key);

    res.send('upload');
});

app.get('/admin', (req, res) => {
    res.send('admin');
});

app.listen(port, () => {
    debugS('서버 시작');
    console.log(`Server is ready on ${port}`);
});
