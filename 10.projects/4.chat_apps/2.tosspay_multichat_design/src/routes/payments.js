/**
 * Toss 결제: 성공 시 크레딧 적립, 실패 페이지, 결제 취소 API
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const config = require('../config');
const paymentsDb = require('../database/payments');
const usersDb = require('../database/users');

const basicAuthHeader =
    'Basic ' + Buffer.from((config.toss.secretKey || '') + ':').toString('base64');
const publicDir = path.join(__dirname, '../../public');

/** 결제 성공 콜백: Toss confirm 호출 후 DB 저장 + 크레딧 적립, 성공 페이지 */
router.get('/payment/success', async (req, res) => {
    const { paymentKey, orderId, amount } = req.query;
    if (!paymentKey || !orderId || !amount) {
        return res.status(400).send('필수 결제 정보가 누락되었습니다.');
    }
    const uid = req.session && req.session.userId;
    if (!uid) {
        return res.redirect('/login?error=로그인 후 다시 시도해주세요.');
    }
    const parsedAmount = Number(amount);

    try {
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            { paymentKey, orderId, amount: parsedAmount },
            {
                headers: {
                    Authorization: basicAuthHeader,
                    'Content-Type': 'application/json',
                },
            }
        );
        const addedCredits = Math.floor(parsedAmount / 100);
        const approvedAt = response.data.approvedAt || new Date().toISOString();
        paymentsDb.create(uid, paymentKey, orderId, parsedAmount, addedCredits, approvedAt);
        const user = usersDb.findById(uid);
        console.log(`[PAYMENT] user ${user.username} +${addedCredits} credits (total: ${user.credits})`);
        res.sendFile(path.join(publicDir, 'payment_success.html'));
    } catch (err) {
        console.error('[PAYMENT CONFIRM ERROR]', err.response?.data || err.message);
        res.redirect('/payment/fail');
    }
});

/** 결제 실패 시 보여줄 페이지 */
router.get('/payment/fail', (req, res) => {
    res.sendFile(path.join(publicDir, 'payment_fail.html'));
});

/** 결제 취소 핸들러 (JSON API용, /api 에서 사용) */
async function cancelPayment(req, res) {
    const userId = req.session && req.session.userId;
    if (!userId) return res.status(401).json({ error: '로그인이 필요합니다.' });

    const { paymentKey } = req.params;
    const entry = paymentsDb.findByPaymentKey(paymentKey);
    if (!entry || entry.user_id !== userId) {
        return res.status(404).json({ error: '해당 결제 내역이 없습니다.' });
    }
    if (entry.status === 'cancelled') {
        return res.status(400).json({ error: '이미 취소된 결제입니다.' });
    }

    try {
        await axios.post(
            `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
            { cancelReason: '고객 요청에 의한 취소' },
            {
                headers: {
                    Authorization: basicAuthHeader,
                    'Content-Type': 'application/json',
                },
            }
        );
        paymentsDb.cancel(userId, paymentKey);
        const user = usersDb.findById(userId);
        console.log(`[CANCEL] user ${user.username} -${entry.added_credits} credits (total: ${user.credits})`);
        res.json({ message: '결제가 취소되었습니다.', credits: user.credits, paymentKey });
    } catch (err) {
        console.error('[CANCEL ERROR]', err.response?.data || err.message);
        const msg = err.response?.data?.message || err.message || '취소 처리 중 오류가 발생했습니다.';
        res.status(err.response?.status || 500).json({ error: msg });
    }
}

/** JSON API 전용 라우터: 결제 취소 (GET /payment/success, /payment/fail 은 위 router 에만 유지) */
const routerApi = express.Router();
routerApi.post('/payments/:paymentKey/cancel', cancelPayment);

module.exports = { router, routerApi };
