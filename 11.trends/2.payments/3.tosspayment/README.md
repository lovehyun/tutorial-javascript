
# Toss Payments 모의 결제 예제 (통합 버전)

본 문서는 **Toss Payments 결제위젯 / API 개별 연동 방식의 차이**,  
그리고 **Node.js 기반 모의 결제 데모 구현 코드 전체**를 하나의 기술 문서로 정리한 것입니다.

---

## 1. 개요

Toss Payments는 결제를 연동하는 두 가지 방식(결제위젯 / API 개별 연동)을 제공합니다.  
이 문서는 두 방식의 차이를 먼저 명확히 설명한 뒤, 실제 **모의 결제 데모 구현(Node.js + HTML)** 예제를 제공합니다.

---

## 2. 결제 방식의 차이: 결제위젯 vs API 개별 연동

| 종류 | 목적 | UI 제공 | 난이도 | 구성 요소 | 특징 |
|------|------|---------|---------|----------------------|---------|
| **결제위젯 연동 키** | 토스가 제공하는 결제 UI를 사용 | ⭕ 제공 | 쉬움 | Client Key + Secret Key | 토스가 UI·보안·인증을 자동 처리 |
| **API 개별 연동 키** | 개발자가 직접 결제 API 호출 구현 | ❌ 없음 | 어려움 | MID(상점 ID)별 API 키 | Kiosk/POS/커스텀 결제에 사용 |

### 결제위젯 연동 키 특징
- **하나의 키로 모든 결제수단(카드/계좌/간편결제 등)을 자동 제공**
- 프런트에서 `requestPayment()` 호출만 하면 토스 UI가 출력됨
- **상점 실사용 기준**이므로 **사업자 등록 + 이용 심사 필수**

### API 개별 연동 키 특징
- 결제창 없이 **백엔드에서 직접 결제 승인/취소 REST API 호출**
- 실제 Production 모드는 역시 사업자 필요하지만
- **Sandbox 테스트는 사업자 없이 사용 가능**

---

## 3. 왜 결제위젯은 사업자등록 필요인데, API 개별 연동은 테스트가 가능한가?

### ✔ 결제위젯이 사업자를 요구하는 이유
- 결제위젯은 “**실제 결제 가능한 상점**”을 구성하는 서비스
- UI·보안·승인 모두 토스가 책임져야 하므로  
  불법 결제/탈세/위험 서비스 방지를 위해 **법적 심사 필수**
- 전자금융거래법에 따른 **PG사 상점 등록 절차** 요구

### ✔ API 개별 연동 테스트가 가능한 이유
- **Sandbox 테스트**는 실제 결제가 발생하지 않기 때문  
- 모든 결제 처리가 모의(Mock) 처리됨 → 사업자 불필요  
- 단, **운영(Production) 전환 시에는 반드시 상점 심사 필요**

---

## 4. 프로젝트 사전 준비

### 4.1 필요한 패키지 설치
```bash
npm install express body-parser axios dotenv
```

### 4.2 환경 변수 (.env)
```plaintext
TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key
```

---

## 5. API 기반 모의 결제 흐름

```
1. 프론트엔드: /request-payment API 호출
2. 서버: orderId, client_key 등 처리
3. 프론트엔드: 결제위젯 또는 Redirect URL 호출
4. 사용자: 결제 진행
5. Toss: successUrl 또는 failUrl 로 Redirect
6. 프론트엔드: /confirm-payment API 호출
7. 서버: /v1/payments/confirm 승인
8. 서버: 크레딧 충전, 결제 DB 저장
9. 사용자: 결제 완료 화면 표시
```

---

## 6. Node.js 서버 코드 (app.js)

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

const CLIENT_KEY = process.env.TOSS_CLIENT_KEY;
const SECRET_KEY = process.env.TOSS_SECRET_KEY;

app.use(bodyParser.json());
app.use(express.static('public'));

// 결제 요청
app.post('/request-payment', async (req, res) => {
    const { amount, orderId, orderName, successUrl, failUrl } = req.body;

    try {
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments',
            {
                orderId,
                orderName,
                amount,
                successUrl,
                failUrl,
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ paymentUrl: response.data.paymentUrl });
    } catch (error) {
        console.error('결제 요청 오류:', error.response?.data);
        res.status(500).json({ error: '결제 요청 실패' });
    }
});

// 결제 승인
app.post('/confirm-payment', async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    try {
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            { paymentKey, orderId, amount },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ success: true, payment: response.data });
    } catch (error) {
        console.error('결제 승인 오류:', error.response?.data);
        res.status(500).json({ error: '결제 승인 실패' });
    }
});

app.get('/success', (req, res) => {
    res.send('<h1>결제 성공</h1>');
});

app.get('/fail', (req, res) => {
    res.send('<h1>결제 실패</h1>');
});

app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
```

---

## 7. 프런트엔드 (index.html)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Toss Payments 모의 결제</title>
</head>
<body>
    <h1>모의 결제</h1>

    <form id="paymentForm">
        <input type="text" id="orderId" placeholder="주문 ID" required />
        <input type="text" id="orderName" placeholder="상품명" required />
        <input type="number" id="amount" placeholder="결제 금액" required />
        <button type="submit">결제하기</button>
    </form>

    <script>
        document.getElementById('paymentForm').addEventListener('submit', async (event) => {
            event.preventDefault();

            const orderId = document.getElementById('orderId').value;
            const orderName = document.getElementById('orderName').value;
            const amount = document.getElementById('amount').value;

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
                window.location.href = data.paymentUrl;
            } else {
                alert('결제 요청 실패');
            }
        });
    </script>
</body>
</html>
```

---

## 8. 테스트 실행 방법

1. [Toss Payments Sandbox에서 API 키 발급](https://sandbox.tosspayments.com) 에서 API 키를 확인하세요.
2. `.env` 작성  
3. 서버 실행  
   ```bash
   node app.js
   ```  
4. `http://localhost:3000` 접속  
5. 결제 테스트

---

## 9. 참고 자료

- [Toss Payments API 문서](https://docs.tosspayments.com/) 
- [Toss Payments 샌드박스](https://sandbox.tosspayments.com/)
