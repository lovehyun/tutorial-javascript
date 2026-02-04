// server.js
require('dotenv').config({ quiet: true });

const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

// 민감정보를 .env 에서 가져옴
// TODO: 개발자센터에서 발급받은 시크릿 키로 교체하세요.
// 시크릿 키는 절대 클라이언트(브라우저) 코드에 노출되면 안 됩니다.
const SECRET_KEY = process.env.TOSS_SECRET_KEY;
const PORT = process.env.PORT || 4242;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));
// JSON Body 파싱
app.use(express.json());

// 결제 승인(confirm) 엔드포인트
app.post('/confirm', async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    // 토스페이먼츠 인증 헤더 생성
    // 시크릿 키 뒤에 ':'를 붙여서 비밀번호 없음 표시 → Base64 인코딩
    const encryptedSecretKey = 'Basic ' + Buffer.from(SECRET_KEY + ':').toString('base64');

    try {
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            {
                orderId,
                amount,
                paymentKey,
            },
            {
                headers: {
                    Authorization: encryptedSecretKey,
                    'Content-Type': 'application/json',
                },
            },
        );

        // TODO: 여기서 결제 성공 비즈니스 로직 (DB 저장 등) 추가
        // console.log(response.data);

        console.log('[결제 승인 완료]');
        console.log('orderId:', response.data.orderId);
        console.log('paymentKey:', response.data.paymentKey);
        console.log('totalAmount:', response.data.totalAmount);
        console.log('method:', response.data.method);
        console.log('approvedAt:', response.data.approvedAt);

        res.status(response.status).json(response.data);
    } catch (error) {
        // axios 에러 처리
        if (error.response) {
            // 토스에서 에러 응답을 보낸 경우
            // TODO: 결제 실패 비즈니스 로직 추가
            // console.error(error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            // 네트워크 오류 등
            console.error(error);
            res.status(500).json({ message: '결제 승인 중 알 수 없는 오류가 발생했습니다.' });
        }
    }
});

// 결제 취소(cancel)
app.post('/cancel', async (req, res) => {
    const { paymentKey, cancelReason } = req.body;

    if (!paymentKey) {
        return res.status(400).json({ message: 'paymentKey가 필요합니다.' });
    }

    // 취소 사유 기본값 (없으면 임의로 설정)
    const reason = cancelReason || '사용자 요청 취소';

    const encryptedSecretKey =
        'Basic ' + Buffer.from(SECRET_KEY + ':').toString('base64');

    try {
        const response = await axios.post(
            `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
            {
                cancelReason: reason,
            },
            {
                headers: {
                    Authorization: encryptedSecretKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        // 취소 결과 서버 콘솔에 출력
        console.log('[결제 취소 완료]');
        console.log('paymentKey:', response.data.paymentKey);
        console.log('orderId:', response.data.orderId);
        console.log('status:', response.data.status); // CANCELED
        const cancels = response.data.cancels;
        if (Array.isArray(cancels) && cancels.length > 0) {
            const lastCancel = cancels[cancels.length - 1];
            console.log('canceledAt:', lastCancel.canceledAt);
            console.log('cancelAmount:', lastCancel.cancelAmount);
            console.log('cancelReason:', lastCancel.cancelReason);
        } else {
            console.log('canceledAt: (cancels 배열 없음)');
        }

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            console.log('❌ [결제 취소 실패]', error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error('❌ 서버 네트워크 오류(취소):', error);
            res.status(500).json({ message: '결제 취소 중 알 수 없는 오류가 발생했습니다.' });
        }
    }
});

// 기본 페이지: 상품 선택(index.html)
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// 체크아웃 페이지
app.get('/checkout', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'checkout2.html'));
});

// 결제 성공 페이지
app.get('/success', (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'public', 'success.html'));
    res.sendFile(path.resolve(__dirname, 'public', 'success2_cancel.html'));
});

// 결제 실패 페이지
app.get('/fail', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'fail.html'));
});

app.listen(PORT, () => {
    console.log(`샘플 앱 실행: http://localhost:${PORT}`);
});
