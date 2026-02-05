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

// 상품 목록 (로컬 예제 데이터)
const products = [
    { id: 'p1', name: '상품1', price: 3000 },
    { id: 'p2', name: '상품2', price: 5000 },
    { id: 'p3', name: '상품3', price: 10000 },
];

// 간단한 주문 저장소 (예제용, 실제 서비스라면 DB 사용)
const orders = {};

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 상품 목록 조회 (API)
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 주문 생성 (API) — 프런트가 선택한 상품을 서버에 먼저 알려주고, 서버가 orderId/금액을 결정
app.post('/api/orders', (req, res) => {
    const { productId } = req.body || {};

    const product = products.find((p) => p.id === productId);
    if (!product) {
        return res.status(400).json({
            message: '존재하지 않는 상품입니다.',
        });
    }

    const orderId = 'ord_' + Math.random().toString(36).slice(2, 12);
    const amount = product.price;
    const orderName = product.name;

    orders[orderId] = {
        orderId,
        productId,
        amount,
        orderName,
        createdAt: new Date().toISOString(),
    };

    res.status(201).json({
        orderId,
        amount,
        orderName,
    });
});

// Client Key 환경변수로부터 전달 (API)
app.get('/api/config', (req, res) => {
    res.json({ clientKey: process.env.TOSS_CLIENT_KEY });
});

// 결제 승인 요청 (API)
app.post('/api/confirm/payment', async (req, res) => {
    const { paymentKey, orderId, amount: clientAmount } = req.body;

    try {
        // 1) 서버에 저장된 주문 정보 조회 (프런트에서 어떤 상품을 담았는지 여기서 알 수 있음)
        const order = orders[orderId];
        if (!order) {
            console.error('알 수 없는 주문 ID로 결제 요청 시도:', { orderId });
            return res.status(400).json({
                message: '알 수 없는 주문입니다.',
                orderId,
            });
        }

        // 2) 토스 confirm 호출 전에,
        //    프런트(리다이렉트 URL)에서 넘어온 amount와 서버 주문 금액이 같은지 1차 검증
        if (clientAmount != null) {
            const clientAmountNumber = Number(clientAmount);
            if (!Number.isFinite(clientAmountNumber) || clientAmountNumber !== order.amount) {
                console.error('사전 금액 검증 실패 (프런트 amount vs 서버 주문 금액):', {
                    orderId,
                    clientAmount,
                    parsedClientAmount: clientAmountNumber,
                    expectedAmount: order.amount,
                });
                return res.status(400).json({
                    message: '리다이렉트로 전달된 결제 금액이 주문 금액과 일치하지 않습니다.',
                    expectedAmount: order.amount,
                    clientAmount: clientAmountNumber,
                });
            }
        }

        // 3) 토스 confirm 호출 전에, 서버에 저장된 주문 금액을 기준으로 amount 결정
        const amount = order.amount;

        // 4) 서버가 알고 있는 orderId/amount로 토스 confirm 호출
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

        const paymentData = response.data;

        // 5) 토스가 실제 승인한 금액과 서버 주문 금액이 일치하는지 최종 검증
        if (order.amount !== paymentData.totalAmount) {
            console.error('결제 금액 불일치 감지:', {
                orderId,
                orderName: paymentData.orderName,
                expectedAmount: order.amount,
                paidAmount: paymentData.totalAmount,
            });
            return res.status(400).json({
                message: '결제 금액이 상품 가격과 일치하지 않습니다.',
                expectedAmount: order.amount,
                paidAmount: paymentData.totalAmount,
            });
        }

        // 금액 검증까지 통과한 경우에만 성공으로 응답
        res.status(200).json(paymentData);
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
