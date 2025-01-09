const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// 가상의 데이터 배열
const data = Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`);
const maxItems = 1000; // 최대 데이터 개수

// 0부터 20 사이의 랜덤 숫자 생성 함수
function getRandomIncrement() {
    return Math.floor(Math.random() * 21); // 0 ~ 20
}

// 10초마다 0~20개의 랜덤 데이터 추가
const intervalId = setInterval(() => {
    if (data.length < maxItems) {
        const randomIncrement = getRandomIncrement();
        const currentLength = data.length;
        for (let i = 0; i < randomIncrement; i++) {
            if (data.length < maxItems) {  // 1000개 초과 방지
                data.push(`Item ${currentLength + i + 1}`);
            }
        }
        console.log(`10초 경과: 데이터가 ${randomIncrement}개 추가되어 총 ${data.length}개가 되었습니다.`);
    } else {
        clearInterval(intervalId); // 최대 개수 도달 시 중지
        console.log(`최대 ${maxItems}개의 데이터에 도달하여 중지합니다.`);
    }
}, 10_000); // 10초마다 실행


// 무한스크롤에 필요한 데이터 반환
function getItems(start, end) {
    return data.slice(start, end);
}

app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/get-items', (req, res) => {
    const { start, end } = req.query;

    // start와 end를 받아 해당 범위의 데이터를 반환
    const items = getItems(parseInt(start), parseInt(end));

    // 클라이언트로 데이터 전송
    res.json(items);
});

// 입력값 검증 및 갯수 반환 기능 추가
app.get('/get-items2', (req, res) => {
    const { start, end } = req.query;

    // start와 end를 숫자로 변환
    const startIndex = parseInt(start, 10);
    const endIndex = parseInt(end, 10);

    // 입력값 검증
    if (isNaN(startIndex) || isNaN(endIndex) || startIndex < 0 || endIndex > data.length) {
        return res.status(400).json({ error: 'Invalid range' });
    }

    // 요청된 범위의 데이터와 총 데이터 개수 반환
    const items = getItems(startIndex, endIndex);
    res.json({ items, total: data.length });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
