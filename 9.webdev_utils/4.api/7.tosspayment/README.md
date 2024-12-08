
# Toss Payments 모의 결제 예제

이 문서는 Toss Payments API를 사용하여 모의 결제를 구현하는 방법을 제공합니다. Node.js를 사용한 서버 구현과 결제를 시작하는 프런트엔드 인터페이스를 포함합니다.

---

## 사전 준비

1. **필요한 패키지 설치**
   ```bash
   npm install express body-parser axios dotenv
   ```

2. **환경 변수 설정**
   프로젝트의 루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 추가합니다:
   ```plaintext
   TOSS_SECRET_KEY=your_toss_secret_key
   TOSS_CLIENT_KEY=your_toss_client_key
   ```

---

## 백엔드 구현

### 서버 코드 (app.js)

서버는 Toss Payments를 사용하여 결제 요청 및 결제 승인을 처리합니다.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Toss API 키
const SECRET_KEY = process.env.TOSS_SECRET_KEY;
const CLIENT_KEY = process.env.TOSS_CLIENT_KEY;

// Body Parser 및 정적 파일 설정
app.use(bodyParser.json());
app.use(express.static('public'));

// 결제 요청 엔드포인트
app.post('/request-payment', async (req, res) => {
    const { amount, orderId, orderName, successUrl, failUrl } = req.body;

    try {
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            {
                orderId,
                orderName,
                amount,
                successUrl,
                failUrl,
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(\`\${SECRET_KEY}:\`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ paymentUrl: response.data.paymentUrl });
    } catch (error) {
        console.error('결제 요청 중 오류:', error.response.data);
        res.status(500).json({ error: '결제 요청 실패' });
    }
});

// 결제 승인 엔드포인트
app.post('/confirm-payment', async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    try {
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            { paymentKey, orderId, amount },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(\`\${SECRET_KEY}:\`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ success: true, payment: response.data });
    } catch (error) {
        console.error('결제 승인 중 오류:', error.response.data);
        res.status(500).json({ error: '결제 승인 실패' });
    }
});

// 성공 및 실패 페이지
app.get('/success', (req, res) => {
    res.send('<h1>결제 성공!</h1>');
});

app.get('/fail', (req, res) => {
    res.send('<h1>결제 실패</h1>');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`http://localhost:\${PORT}에서 서버가 실행 중입니다.`);
});
```

---

## 프런트엔드 구현

### HTML (index.html)

간단한 결제 양식을 제공합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toss Payments 모의 결제</title>
</head>
<body>
    <h1>Toss Payments 모의 결제</h1>
    <form id="paymentForm">
        <input type="text" id="orderId" placeholder="주문 ID" required>
        <input type="text" id="orderName" placeholder="상품명" required>
        <input type="number" id="amount" placeholder="결제 금액" required>
        <button type="submit">결제하기</button>
    </form>
    <script>
        document.getElementById('paymentForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const orderId = document.getElementById('orderId').value;
            const orderName = document.getElementById('orderName').value;
            const amount = document.getElementById('amount').value;

            try {
                const response = await fetch('/request-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId,
                        orderName,
                        amount,
                        successUrl: 'http://localhost:3000/success',
                        failUrl: 'http://localhost:3000/fail',
                    }),
                });

                const data = await response.json();
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl; // Toss 결제 페이지로 리디렉션
                } else {
                    alert('결제 요청 실패.');
                }
            } catch (error) {
                console.error('결제 오류:', error);
            }
        });
    </script>
</body>
</html>
```

---

## 테스트 실행

1. **샌드박스 환경 확인**
   - [Toss Payments 샌드박스](https://sandbox.tosspayments.com)에서 API 키를 확인하세요.

2. **서버 실행**
   ```bash
   node app.js
   ```

3. **브라우저에서 확인**
   - `http://localhost:3000`에 접속하여 결제를 테스트합니다.

---

## 참고 자료

- [Toss Payments API 문서](https://docs.tosspayments.com/)
- [Toss Payments 샌드박스](https://sandbox.tosspayments.com/)
