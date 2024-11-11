// src/controllers/paymentController.js

import fetch from 'node-fetch';

// 결제 승인 요청 처리
async function confirmPayment(req, res) {
    const { paymentKey, orderId, amount, isSuccess } = req.body;

    // 결제 성공 여부에 따라 응답을 처리
    if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({ success: false, message: '필수 파라미터가 누락되었습니다.' });
    }

    // 결제 성공 여부를 임의로 처리
    if (isSuccess) {
        // 결제 성공 처리
        console.log(`결제 승인 성공: ${orderId}, 금액: ${amount}`);
        return res.json({ success: true, message: '결제 승인 성공' });
    } else {
        // 결제 실패 처리
        console.log(`결제 승인 실패: ${orderId}`);
        return res.status(400).json({ success: false, message: '결제 승인 실패' });
    }
}

export { confirmPayment };
