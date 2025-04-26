const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(morgan('dev'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 지역 GeoJSON API 엔드포인트
app.get('/api/geojson/:region', (req, res) => {
    const region = req.params.region.toLowerCase(); // 'seoul' 또는 'jeju'

    const allowedRegions = ['seoul', 'jeju']; // 보안상 허용 목록 제한
    if (!allowedRegions.includes(region)) {
        return res.status(400).json({ error: 'Invalid region' });
    }

    const filePath = path.join(__dirname, 'data', `${region}.geojson`);
    res.sendFile(filePath);
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
