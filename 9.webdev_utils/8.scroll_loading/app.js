const express = require('express');
const app = express();
const PORT = 3000;

// 가상의 데이터 배열
const data = Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`);

// 무한스크롤에 필요한 데이터 반환
function getItems(start, end) {
    return data.slice(start, end);
}

app.use(express.static('public'));

app.get('/get-items', (req, res) => {
    const { start, end } = req.query;

    // start와 end를 받아 해당 범위의 데이터를 반환
    const items = getItems(parseInt(start), parseInt(end));

    // 클라이언트로 데이터 전송
    res.json(items);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
