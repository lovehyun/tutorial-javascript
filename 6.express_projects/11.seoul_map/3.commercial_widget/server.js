const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(morgan('dev'));
app.use(cors());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 지역 GeoJSON API 엔드포인트
app.get('/api/geojson/:region', (req, res) => {
    const region = req.params.region.toLowerCase();

    const allowedRegions = ['seoul', 'jeju']; // 보안상 허용 목록 제한
    if (!allowedRegions.includes(region)) {
        return res.status(400).json({ error: 'Invalid region' });
    }

    const filePath = path.join(__dirname, 'data', `${region}.geojson`);
    res.sendFile(filePath);
});

// 데이터 시각화 API 엔드포인트
app.get('/api/data/:region/:type', (req, res) => {
    const region = req.params.region.toLowerCase();
    const type = req.params.type;

    // 지역 검증
    const allowedRegions = ['seoul', 'jeju'];
    if (!allowedRegions.includes(region)) {
        return res.status(400).json({ error: 'Invalid region' });
    }

    // 데이터 타입 검증
    const allowedTypes = ['sales', 'time', 'gender', 'age', 'type', 'weekday'];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    // 해당 지역의 GeoJSON 파일 읽기
    const filePath = path.join(__dirname, 'data', `${region}.geojson`);
    const geo = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // 지역별 범위 정의
    const seoulRanges = {
        'sales': { min: 50_000_000, max: 900_000_000 },     // 5천만 ~ 9억
        'time': { min: 10_000_000, max: 300_000_000 },      // 1천만 ~ 3억
        'gender': { min: 30, max: 70 },                     // 30% ~ 70% (남성 비율)
        'age': { min: 5_000_000, max: 180_000_000 },        // 5백만 ~ 1억8천만
        'type': { min: 5, max: 50 },                        // 5 ~ 50개 (업종 수)
        'weekday': { min: 20_000_000, max: 500_000_000 }    // 2천만 ~ 5억
    };
    
    const jejuRanges = {
        'sales': { min: 500_000, max: 9_000_000 },          // 50만 ~ 900만 (서울의 1/100)
        'time': { min: 100_000, max: 3_000_000 },           // 10만 ~ 300만 (서울의 1/100)
        'gender': { min: 30, max: 70 },                     // 30% ~ 70% (동일)
        'age': { min: 50_000, max: 1_800_000 },             // 5만 ~ 1백80만 (서울의 1/100)
        'type': { min: 5, max: 50 },                        // 5 ~ 50개 (동일)
        'weekday': { min: 200_000, max: 5_000_000 }         // 20만 ~ 500만 (서울의 1/100)
    };
    
    // 지역에 따라 적절한 범위 선택
    const ranges = region === 'seoul' ? seoulRanges : jejuRanges;
    const range = ranges[type];

    // 랜덤 값 생성 함수
    const getRandomInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // 각 행정동에 랜덤 값 생성
    geo.features.forEach(feature => {
        feature.properties.value = getRandomInRange(range.min, range.max);
    });

    // 타입 관련 정보 정의
    const typeLabels = {
        'sales': '총 매출 금액',
        'time': '저녁 시간대(17-21시) 매출',
        'gender': '남성 매출 비율(%)',
        'age': '20-30대 매출',
        'type': '업종 수',
        'weekday': '주중/주말 총 매출'
    };

    // GeoJSON 메타데이터 추가
    geo.metadata = {
        type: type,
        label: typeLabels[type],
        description: `${region === 'seoul' ? '서울특별시' : '제주특별자치도'} 행정동별 ${typeLabels[type]} 랜덤 데이터`
    };

    res.json(geo);
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
