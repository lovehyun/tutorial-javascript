const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());

// 환경 변수에서 시크릿 키를 읽어옵니다.
const apiSecretKey = process.env.TOSS_SECRET_KEY;
if (!apiSecretKey) {
    throw new Error('API_SECRET_KEY 환경 변수를 설정해주세요.');
}
const encryptedApiSecretKey = 'Basic ' + Buffer.from(apiSecretKey + ':').toString('base64');

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 결제 승인 요청
app.post('/confirm/payment', async (req, res) => {
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
                    Authorization: encryptedApiSecretKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        // 결제 승인 성공
        res.status(200).json(response.data);
    } catch (error) {
        console.error('결제 승인 요청 실패:', error.response?.data || error.message);
        res.status(400).json({ error: error.response?.data || '결제 승인 실패' });
    }
});

// 결제 성공 처리
app.get('/payment/success', async (req, res) => {
    const { paymentKey, orderId, amount } = req.query;

    if (!paymentKey || !orderId || !amount) {
        return res.status(400).send('필수 결제 정보가 누락되었습니다.');
    }

    try {
        // Toss Payments API로 결제 확인
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            {
                paymentKey,
                orderId,
                amount,
            },
            {
                headers: {
                    Authorization: encryptedApiSecretKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        // 검증 성공 시 성공 페이지로 리다이렉트
        res.sendFile(path.join(__dirname, 'public', 'success.html'));
    } catch (error) {
        console.error('결제 검증 실패:', error.response?.data || error.message);
        res.redirect('/payment/fail');
    }
});

// 결제 실패 처리
app.get('/payment/fail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fail.html'));
});

// Client Key 환경변수로부터 전달
app.get('/config', (req, res) => {
    res.json({ clientKey: process.env.TOSS_CLIENT_KEY });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`)
});
