const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// /strong 엔드포인트
app.get('/strong', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'strong.html'));
    // res.sendFile(path.join(__dirname, 'public', 'strong2.html'));
});

// /weak 엔드포인트
app.get('/weak', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'weak.html'));
    // res.sendFile(path.join(__dirname, 'public', 'weak2.html'));
});

app.get('/api/data', (req, res) => {
    // 사용자 입력을 안전하게 처리
    const userData = req.query.data || 'Default Data';
    console.log(userData);

    // 안전하게 처리된 데이터를 응답
    res.json({ data: userData });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
