/**
 * 내 정보 API: 로그인 사용자 기준 크레딧, 결제 목록, 크레딧 이력, 쿠폰
 */
const express = require('express');
const router = express.Router();
const users = require('../database/users');
const payments = require('../database/payments');
const creditLog = require('../database/creditLog');
const { requireAuthApi, attachUser } = require('../middleware/auth');

router.use(attachUser);
router.use(requireAuthApi);

/** 내 정보 (userId, username, credits) */
router.get('/me', (req, res) => {
    const u = req.user;
    if (!u) return res.status(401).json({ error: '로그인이 필요합니다.' });
    res.json({ userId: u.id, username: u.username, credits: u.credits });
});

/** 결제 히스토리 목록 */
router.get('/me/payments', (req, res) => {
    const list = payments.findByUserId(req.user.id);
    const paymentsList = list.map((p) => ({
        paymentKey: p.payment_key,
        orderId: p.order_id,
        amount: p.amount,
        addedCredits: p.added_credits,
        approvedAt: p.approved_at,
        status: p.status,
    }));
    res.json({ payments: paymentsList });
});

/** 크레딧 사용 내역 (증감 이력) */
router.get('/me/credit-log', (req, res) => {
    const list = creditLog.getByUserId(req.user.id);
    res.json({ log: list });
});

/** 쿠폰 코드 → 크레딧 (promo10/30/50) */
const COUPONS = { promo10: 10, promo30: 30, promo50: 50 };

router.post('/me/coupon', (req, res) => {
    const code = (req.body?.code || '').trim().toLowerCase();
    const creditsToAdd = COUPONS[code];
    if (!creditsToAdd) {
        return res.status(400).json({ error: '유효하지 않은 쿠폰 번호입니다.' });
    }
    const updated = users.addCredits(req.user.id, creditsToAdd, 'coupon', code);
    res.json({ message: `${creditsToAdd} 크레딧이 충전되었습니다.`, credits: updated.credits });
});

module.exports = router;
