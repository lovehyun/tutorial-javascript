# 토스 결제 연동 핵심 정리 (index → checkout → success → 서버)

## 1. 단계별 한줄 설명

1. **상품 요약 계산**  
   `calculateSummary()` – 각 상품의 `price × qty` 를 합산해 `{ totalCount, totalAmount, names }` 를 계산한다.

2. **결제 페이지로 이동**  
   `window.location.href = "/checkout.html?amount=...&orderName=..."` – 총 결제 금액과 주문명을 URL 쿼리로 넘겨 checkout 페이지로 이동한다.

3. **결제 정보 표시 및 파라미터 파싱**  
   `new URLSearchParams(window.location.search)` – `amount`, `orderName` 을 읽어 화면에 표시하고 이후 결제에 사용한다.

4. **Toss Payments 위젯 초기화**  
   `const tossPayments = TossPayments(clientKey)` / `tossPayments.widgets({ customerKey })` – 클라이언트 키와 고객 키로 위젯 객체를 생성한다.

5. **결제 금액 설정**  
   `widgets.setAmount({ currency: "KRW", value: amount })` – 실제 결제에 사용할 금액을 위젯에 설정한다.

6. **결제창 호출**  
   `widgets.requestPayment({ orderId, orderName, successUrl, failUrl })` – 주문번호·주문명과 함께 토스 결제창을 띄운다.

7. **결제 성공 후 서버 승인 요청**  
   `POST /confirm` – `successUrl` 로 리다이렉트된 success.html 에서 `{ paymentKey, orderId, amount }` 를 서버로 보내 최종 승인을 요청한다.

8. **서버에서 Toss 승인 API 호출 및 DB 저장**  
   서버에서 토스 `confirm` API에 `{ paymentKey, orderId, amount }` 를 보내 승인 결과를 검증하고, 성공 시 DB에 결제정보를 저장한 뒤 프론트에 최소 정보로 응답한다.


---

## 2. 플로우차트 (Flowchart)

```text
[사용자 index.html]
       |
       v
상품 선택 → 수량 증가/감소 → calculateSummary()
       |
       v
[결제하기 버튼 클릭]
       |
       v
amount, orderName 을 쿼리로 붙여
/checkout.html?amount=...&orderName=... 로 이동
       |
       v
[checkout.html]
       |
       v
URLSearchParams 로 amount, orderName 파싱
       |
       v
TossPayments(clientKey) → widgets = tossPayments.widgets({ customerKey })
       |
       v
widgets.setAmount({ currency: "KRW", value: amount })
       |
       v
[결제하기 버튼 클릭]
       |
       v
widgets.requestPayment({ orderId, orderName, successUrl, failUrl })
       |
       v
┌──────────────┐
│  Toss 결제창 │
└──────────────┘
       |
결제 성공 시 successUrl 로 리다이렉트
(쿼리: paymentKey, orderId, amount)
       |
       v
[success.html]
       |
       v
POST /confirm
  body: { paymentKey, orderId, amount }
       |
       v
[서버 /confirm 핸들러]
       |
       v
토스 Confirm API 호출
  POST https://api.tosspayments.com/v1/payments/confirm
  body: { paymentKey, orderId, amount }
       |
       v
승인 성공 → DB 저장 → JSON 응답
       |
       v
success.html 에서 "결제 완료" 표시
```


---

## 3. 시퀀스 다이어그램 (Sequence Diagram)

```text
사용자          브라우저(index)          브라우저(checkout)         Toss Payments           서버(Backend)
  |                    |                          |                         |                         |
  |-- 상품 선택/수량변경 -->|                          |                         |                         |
  |                    |-- calculateSummary() ---->|                         |                         |
  |                    |                          |                         |                         |
  |-- "결제하기" 클릭 -->|                          |                         |                         |
  |                    |-- window.location.href --> /checkout.html?amount&orderName
  |                    |                          |                         |                         |
  |                    |                          |-- URLSearchParams() ---->                         |
  |                    |                          |  amount, orderName 사용  |                         |
  |                    |                          |                         |                         |
  |                    |                          |-- TossPayments(clientKey)                         |
  |                    |                          |-- widgets = tossPayments.widgets({ customerKey }) |
  |                    |                          |-- widgets.setAmount({ currency, value }) -------->|
  |                    |                          |                         |                         |
  |                    |                          |-- "결제하기" 클릭 ------>|                         |
  |                    |                          |-- widgets.requestPayment(...) ------------------->|
  |                    |                          |                         |  결제 진행              |
  |                    |                          |                         |-- successUrl redirect ->|
  |                    |                          |<---------------------- success.html 로 이동 ------|
  |                    |<------------------------ 성공 페이지 표시 ---------|                         |
  |                    |                          |-- POST /confirm(paymentKey, orderId, amount) --->|
  |                    |                          |                         |-- Toss Confirm API ---->|
  |                    |                          |                         |<-- 승인 결과 -----------|
  |                    |                          |<---------------------- JSON 응답 ------------------|
  |                    |<------------------------ "결제 완료" 상태 확인 ----|                         |
```


---

## 4. 실제 호출 함수 / API 정리

### 4.1. 프론트엔드 (index.html)

#### 1) `calculateSummary()`

```js
function calculateSummary() {
  let totalCount = 0;
  let totalAmount = 0;
  let names = [];

  items.forEach((item) => {
    const price = Number(item.dataset.price);
    const name = item.dataset.name;
    const qty = Number(item.querySelector('.qty').textContent);

    if (qty > 0) {
      totalCount += qty;
      totalAmount += price * qty;
      names.push(`${name} x${qty}`);
    }
  });

  return { totalCount, totalAmount, names };
}
```

- **역할**: 화면에 표시된 상품 리스트를 기준으로 총 수량, 총 금액, 주문명 배열을 계산한다.  
- **인자**: 없음(전역 `items` NodeList 사용)  
- **반환값**: `{ totalCount: number, totalAmount: number, names: string[] }`


#### 2) 결제 페이지 이동 핸들러

```js
goCheckoutButton.addEventListener('click', () => {
  const { totalAmount, names } = calculateSummary();
  if (totalAmount <= 0) return;

  let orderName = '장바구니 상품';
  if (names.length === 1) {
    orderName = names[0];
  } else if (names.length > 1) {
    orderName = `${names[0]} 외 ${names.length - 1}건`;
  }

  const params = new URLSearchParams();
  params.set('amount', totalAmount);
  params.set('orderName', orderName);

  window.location.href = `/checkout.html?${params.toString()}`;
});
```

- **역할**: 요약 정보로부터 `amount`, `orderName` 을 만들고 checkout 페이지로 이동한다.  
- **인자**: 없음 (클릭 이벤트 리스너 내부)  
- **출력**: 브라우저 위치 변경 (`/checkout.html?...`)  


---

### 4.2. 프론트엔드 (checkout.html)

#### 3) URL 파라미터 파싱

```js
const urlParams = new URLSearchParams(window.location.search);
const amount = Number(urlParams.get("amount")) || 0;
const orderName = urlParams.get("orderName") || "상품 결제";
```

- **역할**: index.html 에서 전달한 결제 금액과 주문명을 읽어온다.  
- **인자**: 없음(전역 `window.location.search` 사용)  
- **출력**: `amount: number`, `orderName: string` 상수에 값 저장


#### 4) TossPayments 초기화 및 위젯 생성

```js
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = btoa(Math.random()).slice(0, 20);

const tossPayments = TossPayments(clientKey);
const widgets = tossPayments.widgets({ customerKey });
```

- **역할**: 토스 결제 위젯을 사용하기 위한 기본 객체를 생성한다.  
- **인자**:  
  - `clientKey: string` – 토스에서 발급한 클라이언트 키  
  - `customerKey: string` – 서비스 내에서 사용자를 구분할 고유 키  
- **출력**: `tossPayments` 인스턴스, `widgets` 인스턴스


#### 5) 결제 금액 설정

```js
await widgets.setAmount({
  currency: "KRW",
  value: amount,
});
```

- **역할**: 위젯에 실제 결제 금액을 설정한다.  
- **인자**: `{ currency: "KRW", value: number }`  
- **출력**: Promise (별도 반환값 사용 X)


#### 6) 결제수단 / 약관 UI 렌더링

```js
await widgets.renderPaymentMethods({
  selector: "#payment-method",
  variantKey: "DEFAULT",
});

await widgets.renderAgreement({
  selector: "#agreement",
  variantKey: "AGREEMENT",
});
```

- **역할**: 각각 결제수단 선택 영역과 약관 동의 영역을 지정된 DOM에 렌더링한다.  
- **인자**:  
  - `selector: string` – 렌더링할 DOM 선택자  
  - `variantKey: string` – 토스에서 정의된 UI 변형 키  
- **출력**: Promise (DOM 렌더링 완료)


#### 7) 결제 요청

```js
document.getElementById("go-pay").addEventListener("click", async () => {
  await widgets.requestPayment({
    orderId: btoa(Math.random()).slice(0, 20),
    orderName: orderName,
    successUrl: window.location.origin + "/success.html",
    failUrl: window.location.origin + "/fail.html",
  });
});
```

- **역할**: 사용자가 최종 “결제하기” 버튼을 클릭했을 때 토스 결제창을 호출한다.  
- **인자**:  
  - `orderId: string` – 상점(내 서비스)에서 생성한 주문 고유 ID  
  - `orderName: string` – 주문명(상품 이름 요약)  
  - `successUrl: string` – 결제 성공 시 리다이렉트될 URL  
  - `failUrl: string` – 결제 실패 시 리다이렉트될 URL  
- **출력**: 사용자 브라우저가 토스 결제창 및 이후 success/fail URL로 이동


---

### 4.3. 프론트엔드 (success.html)

#### 8) 서버 승인 요청 (`/confirm` 호출)

```js
async function confirm() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestData = {
    paymentKey: urlParams.get("paymentKey"),
    orderId: urlParams.get("orderId"),
    amount: urlParams.get("amount"),
  };

  const response = await fetch("/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  const json = await response.json();
  return { ok: response.ok, data: json };
}
```

- **역할**: 토스에서 리다이렉트하면서 넘겨준 `paymentKey`, `orderId`, `amount` 로 서버에 최종 승인을 요청한다.  
- **인자**: 없음 (URL 쿼리에서 직접 읽음)  
- **출력**: `{ ok: boolean, data: any }` – 서버 응답 래핑


---

### 4.4. 백엔드 (Express 서버)

#### 9) `POST /confirm` 라우트

```js
app.post('/confirm', async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ message: '잘못된 요청입니다.' });
  }

  const encryptedSecretKey =
    'Basic ' + Buffer.from(SECRET_KEY + ':').toString('base64');

  try {
    const response = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      { orderId, amount, paymentKey },
      {
        headers: {
          Authorization: encryptedSecretKey,
          'Content-Type': 'application/json',
        },
      },
    );

    // TODO: DB 저장 등 비즈니스 로직
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: '결제 승인 중 알 수 없는 오류가 발생했습니다.' });
    }
  }
});
```

- **역할**: 프론트(success.html)로부터 받은 결제 정보를 기반으로 토스 결제 승인 API를 호출하고, 그 결과를 그대로(또는 가공해서) 프론트에 돌려준다.  
- **인자 (req.body)**:  
  - `paymentKey: string` – 토스 측 결제 식별자  
  - `orderId: string` – 상점 주문번호  
  - `amount: number` – 결제 금액  
- **외부 API 호출**:  
  - URL: `https://api.tosspayments.com/v1/payments/confirm`  
  - 메서드: `POST`  
  - 바디: `{ orderId, amount, paymentKey }`  
  - 헤더: `Authorization: Basic <base64(SECRET_KEY + ":")>`, `Content-Type: application/json`  
- **출력**:  
  - 성공: `res.status(200).json(response.data)` – 토스 승인 응답을 반환  
  - 실패: 토스 에러 응답 또는 500 에러 반환


---

