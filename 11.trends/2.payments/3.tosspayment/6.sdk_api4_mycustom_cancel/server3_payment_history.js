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
    throw new Error('TOSS_SECRET_KEY 환경 변수를 설정해주세요.');
}
const encodedApiSecretKey = 'Basic ' + Buffer.from(apiSecretKey + ':').toString('base64');

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
})

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
                    Authorization: encodedApiSecretKey,
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

// 로컬 날짜로 YYYY-MM-DD 생성 (toISOString은 UTC라 한국 오늘 거래가 빠질 수 있음)
function toLocalDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
}

// 거래 조회 (동기 — 토스 API 응답까지 대기 후 반환, 최대 90초)
app.get('/api/transactions', async (req, res) => {
    const end = new Date();
    const start = new Date(end);
    const days = Math.min(Number(req.query.days) || 7, 90);
    start.setDate(start.getDate() - days);
    const startDate = req.query.startDate || toLocalDateStr(start) + 'T00:00:00';
    const endDate = req.query.endDate || toLocalDateStr(end) + 'T23:59:59';
    const limit = Math.min(Number(req.query.limit) || 50, 500);

    console.log('[거래 조회] 요청:', { startDate, endDate, limit });
    try {
        const response = await axios.get(
            'https://api.tosspayments.com/v1/transactions',
            {
                params: { startDate, endDate, limit },
                headers: { Authorization: encodedApiSecretKey },
                timeout: 90000,
            }
        );
        const data = response.data;
        console.log('[거래 조회] 성공, 건수:', Array.isArray(data) ? data.length : '-');
        res.status(200).json(data);
    } catch (error) {
        const status = error.response?.status;
        const body = error.response?.data;
        console.error('[거래 조회] 실패:', status, body || error.message);
        res.status(status || 500).json(
            body && typeof body === 'object' ? body : { message: error.message || '거래 조회 실패' }
        );
    }
});

// 결제 취소 (토스페이먼츠 결제 취소 API 프록시)
app.post('/api/payments/:paymentKey/cancel', async (req, res) => {
    const paymentKey = req.params.paymentKey;
    const { cancelReason, cancelAmount } = req.body || {};
    const reason = cancelReason || '결제 내역 화면에서 요청한 취소';

    try {
        const body = { cancelReason: reason };
        if (cancelAmount != null && cancelAmount > 0) body.cancelAmount = Number(cancelAmount);
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/' + encodeURIComponent(paymentKey) + '/cancel',
            body,
            {
                headers: {
                    Authorization: encodedApiSecretKey,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('결제 취소 실패:', paymentKey, status, data || error.message);
        res.status(status || 500).json(
            data && typeof data === 'object' ? data : { message: error.message || '결제 취소 실패' }
        );
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`)
});
