const express = require('express');
const path = require('path');
const xss = require('xss');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// 저장 엔드포인트 (안전한 방식으로 입력 내용 출력)
app.post('/save', (req, res) => {
    const content = req.body.content;

    // 안전한 방식으로 입력 내용 출력
    // res.send(`<h2>저장된 내용:</h2><p>${xss(content)}</p>`);

    const safeOutput = xss(content);
    console.log(safeOutput);

    res.send(`<h2>저장된 내용:</h2><p>${safeOutput}</p>`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
