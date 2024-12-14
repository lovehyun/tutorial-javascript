// server.js

const express = require('express');
const path = require('path');
const { getSeoulPopulationData } = require('./data'); // data.js 파일에서 데이터 가져오기

const app = express();
const port = 3000;

app.use(express.static('public')); // 정적 파일(public 폴더)을 제공하기 위한 미들웨어 추가

app.get('/api/seoulData', (req, res) => {
    const seoulData = getSeoulPopulationData();
    res.json(seoulData);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/population_map2.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
