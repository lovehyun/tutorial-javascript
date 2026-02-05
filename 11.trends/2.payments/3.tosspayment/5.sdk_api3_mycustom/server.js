require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());

// 환경 변수에서 시크릿 키를 읽어옵니다.
const apiSecretKey = process.env.TOSS_SECRET_KEY;
if (!apiSecretKey) {
    throw new Error('TOSS_SECRET_KEY 환경 변수를 설정해주세요.');
}
const encodedApiSecretKey = 'Basic ' + Buffer.from(apiSecretKey + ':').toString('base64');

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 결제 승인 요청 (API)
// 프론트엔드에서는 `/api/confirm/payment` 로 호출합니다.
app.post('/api/confirm/payment', async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    try {
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            {
                paymentKey,
                orderId,
                amount,
            },
            {
                headers: {
                    Authorization: encodedApiSecretKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        // 결제 승인 성공
        res.status(200).json(response.data);
    } catch (error) {
        console.error('결제 승인 요청 실패:', error.message);
        res.status(400).json({ message: error.message || '결제 승인 실패' });
    }
});

// 메인 상품 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
})

// 결제 성공 페이지
app.get('/payment/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// 결제 실패 페이지
app.get('/payment/fail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fail.html'));
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`)
});
