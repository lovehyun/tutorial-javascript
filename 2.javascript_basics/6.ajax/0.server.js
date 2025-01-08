// server.js
// npm install express
// node server.js
// public/index.html 파일 추가 (1.ajax_localhost.html)

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ajax.html'));
});

app.get('/data', (req, res) => {
    res.json({ title: 'Hello World', body: 'This is a response from the local server.' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
