# 변경 코드 Diff (3.sdk_api_official → 4.sdk_api2_mine)

- **원본**: `../3.sdk_api_official/`
- **변경본**: `4.sdk_api2_mine/` (현재 폴더)
- diff 규칙: `-` = 원본(삭제된 줄), `+` = 변경본(추가된 줄)

---

## 목차 (변경/추가된 파일)

| 단계 | 경로 | 구분 |
|------|------|------|
| 1 | package.json | 수정 |
| 1 | server.js | 수정 |
| 1 | .gitignore | **신규** |
| 1 | env.template | **신규** |
| 1 | README.md | 수정 |
| 2 | public/index.html | **신규** |
| 2·3 | public/widget/checkout.html | 수정 |
| 2·3 | public/payment/checkout.html | 수정 |
| 2·3 | public/brandpay/checkout.html | 수정 |
| 5 | public/widget/success.html | 수정 |
| 5 | public/payment/success.html | 수정 |
| 5 | public/brandpay/success.html | 수정 |
| - | public/fail.html, style.css, payment/billing.html | **변경 없음** |

---

## 1단계: 민감 키 .env 분리

### package.json

```diff
--- 3.sdk_api_official/package.json
+++ 4.sdk_api2_mine/package.json
@@ -9,6 +9,7 @@
   "license": "MIT",
   "dependencies": {
+    "dotenv": "^16.4.5",
     "express": "^4.19.2"
   }
 }
```

---

### server.js

```diff
--- 3.sdk_api_official/server.js
+++ 4.sdk_api2_mine/server.js
@@ -1,21 +1,38 @@
+require("dotenv").config();
 const express = require("express");
 const app = express();
-const port = 4000;
+const port = process.env.PORT || 4000;
 
 app.use(express.static("public"));
 app.use(express.json());
 
-// TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
-// @docs https://docs.tosspayments.com/reference/using-api/api-keys
-const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
-const apiSecretKey = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";
+// 시크릿 키는 .env에서 로드 (env.template 참고)
+const widgetSecretKey = process.env.TOSSPAYMENTS_WIDGET_SECRET_KEY;
+const apiSecretKey = process.env.TOSSPAYMENTS_API_SECRET_KEY;
 
 // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
 // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
 // @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
-const encryptedWidgetSecretKey = "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");
-const encryptedApiSecretKey = "Basic " + Buffer.from(apiSecretKey + ":").toString("base64");
+const encryptedWidgetSecretKey =
+  widgetSecretKey ? "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64") : "";
+const encryptedApiSecretKey =
+  apiSecretKey ? "Basic " + Buffer.from(apiSecretKey + ":").toString("base64") : "";
+
+// 클라이언트용 공개 설정 (클라이언트 키만 노출, 시크릿 키는 제외)
+app.get("/api/config", function (req, res) {
+  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
+  res.json({
+    widgetClientKey: process.env.TOSSPAYMENTS_WIDGET_CLIENT_KEY || "",
+    apiClientKey: process.env.TOSSPAYMENTS_API_CLIENT_KEY || "",
+    baseUrl,
+  });
+});
+
+// 결제 승인 공통: 토스 API는 amount를 숫자로 받음. 시크릿 키 없으면 승인 불가(개발자 포털에 기록 안 남음)
+function requireWidgetSecret(req, res, next) {
+  if (!encryptedWidgetSecretKey) {
+    console.error("[결제 승인 실패] TOSSPAYMENTS_WIDGET_SECRET_KEY가 .env에 없습니다. 개발자 포털에 결제 이력이 남지 않습니다.");
+    return res.status(500).json({ code: "MISSING_SECRET", message: "서버에 위젯 시크릿 키가 설정되지 않았습니다. .env를 확인하세요." });
+  }
+  next();
+}
 
 // 결제위젯 승인
-app.post("/confirm/widget", function (req, res) {
+app.post("/confirm/widget", requireWidgetSecret, function (req, res) {
   const { paymentKey, orderId, amount } = req.body;
+  const amountNum = Number(amount);
+  if (!paymentKey || !orderId || !amount || isNaN(amountNum)) {
+    return res.status(400).json({ code: "INVALID_BODY", message: "paymentKey, orderId, amount가 필요합니다." });
+  }
 
   // 결제 승인 API를 호출하세요.
   // 결제를 승인하면 결제수단에서 금액이 차감돼요.
   // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
   fetch("https://api.tosspayments.com/v1/payments/confirm", {
@@ -25,23 +42,32 @@
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
-      orderId: orderId,
-      amount: amount,
-      paymentKey: paymentKey,
+      orderId,
+      amount: amountNum,
+      paymentKey,
     }),
   })
-  }).then(async function (response) {
+    .then(async function (response) {
       const result = await response.json();
-    console.log(result);
+      console.log("[위젯 승인 응답]", response.status, result);
+      if (!response.ok) {
+        return res.status(response.status).json(result);
+      }
+      res.status(response.status).json(result);
+    })
+    .catch(function (err) {
+      console.error("[위젯 승인 오류]", err);
+      res.status(500).json({ code: "SERVER_ERROR", message: err.message || "결제 승인 요청 중 오류가 났습니다." });
+    });
+});
+
+// 결제창 승인
+function requireApiSecret(req, res, next) {
+  if (!encryptedApiSecretKey) {
+    console.error("[결제 승인 실패] TOSSPAYMENTS_API_SECRET_KEY가 .env에 없습니다.");
+    return res.status(500).json({ code: "MISSING_SECRET", message: "서버에 API 시크릿 키가 설정되지 않았습니다. .env를 확인하세요." });
+  }
+  next();
+}
 
-    if (!response.ok) {
-      // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
-      res.status(response.status).json(result);
-
-      return;
-    }
-
-    // TODO: 결제 완료 비즈니스 로직을 구현하세요.
-    res.status(response.status).json(result);
-  });
-});
-
-// 결제창 승인
-app.post("/confirm/payment", function (req, res) {
+app.post("/confirm/payment", requireApiSecret, function (req, res) {
   const { paymentKey, orderId, amount } = req.body;
+  const amountNum = Number(amount);
+  if (!paymentKey || !orderId || !amount || isNaN(amountNum)) {
+    return res.status(400).json({ code: "INVALID_BODY", message: "paymentKey, orderId, amount가 필요합니다." });
+  }
 
   // 결제 승인 API를 호출하세요.
   // 결제를 승인하면 결제수단에서 금액이 차감돼요.
   // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
   fetch("https://api.tosspayments.com/v1/payments/confirm", {
@@ -51,23 +77,32 @@
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
-      orderId: orderId,
-      amount: amount,
-      paymentKey: paymentKey,
+      orderId,
+      amount: amountNum,
+      paymentKey,
     }),
   })
-  }).then(async function (response) {
+    .then(async function (response) {
       const result = await response.json();
-    console.log(result);
+      console.log("[결제창 승인 응답]", response.status, result);
+      if (!response.ok) {
+        return res.status(response.status).json(result);
+      }
+      res.status(response.status).json(result);
+    })
+    .catch(function (err) {
+      console.error("[결제창 승인 오류]", err);
+      res.status(500).json({ code: "SERVER_ERROR", message: err.message || "결제 승인 요청 중 오류가 났습니다." });
+    });
+});
 
-    if (!response.ok) {
-      // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
-      res.status(response.status).json(result);
-
-      return;
-    }
-
-    // TODO: 결제 완료 비즈니스 로직을 구현하세요.
-    res.status(response.status).json(result);
-  });
-});
-
 // 브랜드페이 승인
-app.post("/confirm/brandpay", function (req, res) {
+app.post("/confirm/brandpay", requireApiSecret, function (req, res) {
   const { paymentKey, orderId, amount, customerKey } = req.body;
+  const amountNum = Number(amount);
+  if (!paymentKey || !orderId || !amount || isNaN(amountNum)) {
+    return res.status(400).json({ code: "INVALID_BODY", message: "paymentKey, orderId, amount, customerKey가 필요합니다." });
+  }
 
   // 결제 승인 API를 호출하세요.
   // 결제를 승인하면 결제수단에서 금액이 차감돼요.
   // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
   fetch("https://api.tosspayments.com/v1/brandpay/payments/confirm", {
@@ -77,23 +112,32 @@
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
-      orderId: orderId,
-      amount: amount,
-      paymentKey: paymentKey,
-      customerKey: customerKey,
+      orderId,
+      amount: amountNum,
+      paymentKey,
+      customerKey,
     }),
   })
-  }).then(async function (response) {
+    .then(async function (response) {
       const result = await response.json();
-    console.log(result);
+      console.log("[브랜드페이 승인 응답]", response.status, result);
+      if (!response.ok) {
+        return res.status(response.status).json(result);
+      }
+      res.status(response.status).json(result);
+    })
+    .catch(function (err) {
+      console.error("[브랜드페이 승인 오류]", err);
+      res.status(500).json({ code: "SERVER_ERROR", message: err.message || "결제 승인 요청 중 오류가 났습니다." });
+    });
+});
 
-    if (!response.ok) {
-      // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
-      res.status(response.status).json(result);
-
-      return;
-    }
-
-    // TODO: 결제 완료 비즈니스 로직을 구현하세요.
-    res.status(response.status).json(result);
-  });
-});
 (※ 위 블록 이후: callback-auth, issue-billing-key, confirm-billing 라우트는 원본과 동일. listen 부분만 아래처럼 변경)

```diff
 @@ -221,4 +265,8 @@
   });
 });
 
-app.listen(port, () => console.log(`http://localhost:${port} 으로 샘플 앱이 실행되었습니다.`));
+app.listen(port, () => {
+  console.log(`http://localhost:${port} 으로 샘플 앱이 실행되었습니다.`);
+  if (!widgetSecretKey) console.warn("[경고] TOSSPAYMENTS_WIDGET_SECRET_KEY가 없습니다. 위젯 결제 승인 시 개발자 포털에 이력이 남지 않습니다.");
+  if (!apiSecretKey) console.warn("[경고] TOSSPAYMENTS_API_SECRET_KEY가 없습니다. 결제창/브랜드페이 승인 시 개발자 포털에 이력이 남지 않습니다.");
+});
```
 
 (server.js 나머지: /callback-auth, /issue-billing-key, /confirm-billing 는 원본과 동일)

---

### .gitignore (신규)

```diff
--- /dev/null
+++ 4.sdk_api2_mine/.gitignore
@@ -0,0 +1,3 @@
+node_modules/
+.env
+
```

---

### env.template (신규)

```diff
--- /dev/null
+++ 4.sdk_api2_mine/env.template
@@ -0,0 +1,21 @@
+# 토스페이먼츠 API 키 (개발자센터에서 발급)
+# @docs https://docs.tosspayments.com/reference/using-api/api-keys
+
+# 결제위젯 연동 - 시크릿 키 (서버 전용, 외부 노출 금지)
+TOSSPAYMENTS_WIDGET_SECRET_KEY=
+
+# 결제위젯 연동 - 클라이언트 키 (위젯/결제창 초기화용)
+TOSSPAYMENTS_WIDGET_CLIENT_KEY=
+
+# API 개별 연동 - 시크릿 키 (서버 전용, 외부 노출 금지)
+TOSSPAYMENTS_API_SECRET_KEY=
+
+# API 개별 연동 - 클라이언트 키 (결제창/브랜드페이 초기화용)
+TOSSPAYMENTS_API_CLIENT_KEY=
+
+# 서버 포트
+PORT=4000
+
+# (선택) 브랜드페이 Redirect URL 기준. 미설정 시 http://localhost:PORT 사용
+# BASE_URL=http://localhost:4000
```

---

### README.md

```diff
--- 3.sdk_api_official/README.md
+++ 4.sdk_api2_mine/README.md
@@ -14,24 +14,27 @@
 
 ## 실행하기
 
-1. 샘플 프로젝트 레포지토리를 클론(Clone)하고 express-javascript 폴더로 진입하세요.
+1. 샘플 프로젝트 레포지토리를 클론(Clone)하고 프로젝트 폴더로 진입하세요.
 
    ```sh
-   $ git clone https://github.com/tosspayments/tosspayments-sample # 샘플 프로젝트 클론
-   $ cd tosspayments-sample/express-javascript
+   $ git clone <repository-url>
+   $ cd 4.sdk_api2_mine
    ```
 
-2. 의존성 패키지를 다운로드하고 서버를 실행합니다.
+2. 환경 변수 설정: `env.template`을 복사해 `.env` 파일을 만들고, [개발자센터](https://developers.tosspayments.com/my/api-keys)에서 발급한 키를 입력하세요. (미설정 시 샘플용 테스트 키가 하드코딩된 값으로 동작하지 않을 수 있습니다.)
+
+   ```sh
+   $ cp env.template .env
+   # .env 파일을 열어 TOSSPAYMENTS_* 키 값을 입력하세요.
+   ```
+
+3. 의존성 패키지를 다운로드하고 서버를 실행합니다.
 
    ```sh
-   $ npm install # 의존성 패키지 다운로드
-   $ npm start # 서버 실행
+   $ npm install
+   $ npm start
    ```
 
-3. 로컬 환경에서 샘플 프로젝트를 확인하세요.
+4. 로컬 환경에서 샘플 프로젝트를 확인하세요.
 
-| 제품                      | 링크                                         |
-| ------------------------- | -------------------------------------------- |
+| 페이지 | 링크 |
+|--------|------|
+| **상품 목록·장바구니** (결제하기 → 위젯 결제) | http://localhost:4000/ 또는 http://localhost:4000/index.html |
 | 결제위젯                  | http://localhost:4000/widget/checkout.html   |
 | 결제창(일반결제/정기결제) | http://localhost:4000/payment/checkout.html  |
 | 브랜드페이                | http://localhost:4000/brandpay/checkout.html |
@@ -40,19 +43,26 @@
 
 ## 인증하기
 
-샘플에 있는 키로 연동이 가능하지만, 내 테스트 연동 키를 사용하면 테스트 결제내역, 웹훅 기능을 사용할 수 있어요. 내 테스트 연동 키는 [개발자센터](https://developers.tosspayments.com/my/api-keys)에서 확인할 수 있습니다. 더 자세한 내용은 [API 키 가이드](https://docs.tosspayments.com/reference/using-api/api-keys)를 참고하세요.
+모든 API 키는 `.env` 파일에서 관리합니다. `env.template`을 복사해 `.env`를 만든 뒤 [개발자센터](https://developers.tosspayments.com/my/api-keys)에서 발급한 키를 입력하세요. 더 자세한 내용은 [API 키 가이드](https://docs.tosspayments.com/reference/using-api/api-keys)를 참고하세요.
 
-- **클라이언트 키**
-
-  - **결제위젯**: `public/widget/checkout.html` 파일에 있는 `clientKey`를 내 결제위젯 연동 클라이언트 키로 수정하세요.
-  - **결제창 및 브랜드페이**: `public/payment/checkout.html`, `public/brandpay/checkout.html` 파일에 있는 `clientKey`를 내 API 개별 연동 클라이언트 키로 수정하세요.
-
-- **시크릿 키**
-
-  - **결제위젯**: `server.js` 파일에 있는 `widgetSecretKey`를 내 결제위젯 시크릿 키로 수정하세요.
-  - **결제창 및 브랜드페이**: `server.js` 파일에 있는 `apiSecretKey`를 내 API 개별 연동 시크릿 키로 수정하세요.
-
-  \* 시크릿 키는 외부에 절대 노출되면 안 됩니다.
+| env 키 | 설명 |
+|--------|------|
+| `TOSSPAYMENTS_WIDGET_SECRET_KEY` | 결제위젯 시크릿 키 (서버 전용, 노출 금지) |
+| `TOSSPAYMENTS_WIDGET_CLIENT_KEY` | 결제위젯 클라이언트 키 |
+| `TOSSPAYMENTS_API_SECRET_KEY` | API 개별 연동 시크릿 키 (서버 전용, 노출 금지) |
+| `TOSSPAYMENTS_API_CLIENT_KEY` | API 개별 연동 클라이언트 키 (결제창/브랜드페이) |
+| `PORT` | 서버 포트 (기본 4000) |
+
+\* 시크릿 키는 외부에 절대 노출되면 안 됩니다. `.env`는 `.gitignore`에 포함되어 있어 저장소에 올라가지 않습니다.
 
 - **브랜드페이**
   - 브랜드페이를 테스트하고 싶다면 반드시 클라이언트 키, 시크릿 키를 내 키로 바꿔주세요.
   - 개발자센터의 브랜드페이 메뉴에서 리다이렉트 URL도 반드시 등록해야 됩니다. `public/brandpay/checkout.html` 파일을 참고해주세요.
+
+## 추가로 뽑아낼 수 있는 고정값 (선택)
+... (표 및 index.html 결제 시 sessionStorage 안내 추가)
 
 ## 더 알아보기
```

---

## 2·3단계: 장바구니 + 결제 수단 선택

### public/index.html (신규)

- 원본에는 없음. **4.sdk_api2_mine/public/index.html** 전체가 새 파일.
- 구성: 상품 3종(1,000/1,500/2,000원), 담기, 장바구니 테이블(수량 ±), 총 결제 금액, 결제하기 → 결제 수단 선택(위젯/일반/브랜드페이) + 취소 버튼, `getCartSummary()`·sessionStorage 저장·각 결제 페이지로 이동.

(전체 내용이 길어 여기서는 요약. 실제 diff는 `3.sdk_api_official`에 해당 파일이 없으므로 `+`만 있는 “신규 파일” 형태.)

---

### public/widget/checkout.html

```diff
--- 3.sdk_api_official/public/widget/checkout.html
+++ 4.sdk_api2_mine/public/widget/checkout.html
@@ -42,13 +42,22 @@
       main();
 
       async function main() {
+        const configRes = await fetch("/api/config");
+        const config = await configRes.json();
+        const clientKey = config.widgetClientKey;
+        if (!clientKey) {
+          console.error("TOSSPAYMENTS_WIDGET_CLIENT_KEY가 .env에 설정되지 않았습니다.");
+        }
+
         const button = document.getElementById("payment-button");
         const coupon = document.getElementById("coupon-box");
-        const amount = {
-          currency: "KRW",
-          value: 50000,
-        };
+        // index.html 장바구니에서 넘어온 경우 sessionStorage 값 사용, 없으면 기존 기본값
+        const storedAmount = sessionStorage.getItem("paymentAmount");
+        const storedOrderName = sessionStorage.getItem("paymentOrderName");
+        const amountValue = storedAmount ? Number(storedAmount) : 50000;
+        const orderName = storedOrderName || "토스 티셔츠 외 2건";
+        const amount = {
+          currency: "KRW",
+          value: amountValue,
+        };
         // ------  결제위젯 초기화 ------
-        // TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
         // TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
         // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
-        const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
         const customerKey = generateRandomString();
         const tossPayments = TossPayments(clientKey);
@@ -112,7 +121,6 @@
         // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
         // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
         button.addEventListener("click", async function () {
-          // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
           // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
           await widgets.requestPayment({
             orderId: generateRandomString(),
-            orderName: "토스 티셔츠 외 2건",
+            orderName: orderName,
             successUrl: window.location.origin + "/widget/success.html",
             failUrl: window.location.origin + "/fail.html",
             customerEmail: "customer123@gmail.com",
```

---

### public/payment/checkout.html

```diff
--- 3.sdk_api_official/public/payment/checkout.html
+++ 4.sdk_api2_mine/public/payment/checkout.html
@@ -34,14 +34,28 @@
     </div>
     <script>
-      const amount = {
-        currency: "KRW",
-        value: 50000,
-      };
+      // index 장바구니에서 넘어온 경우 sessionStorage 값 사용
+      const storedAmount = sessionStorage.getItem("paymentAmount");
+      const storedOrderName = sessionStorage.getItem("paymentOrderName");
+      const amountValue = storedAmount ? Number(storedAmount) : 50000;
+      const orderName = storedOrderName || "토스 티셔츠 외 2건";
+      const amount = {
+        currency: "KRW",
+        value: amountValue,
+      };
 
       let selectedPaymentMethod = null;
+      let tossPayments;
+      let payment;
+      let customerKey;
 
       function selectPaymentMethod(method) {
@@ -54,18 +68,26 @@
         document.getElementById(selectedPaymentMethod).style.backgroundColor = "rgb(229 239 255)";
       }
 
-      // ------  SDK 초기화 ------
-      // TODO: clientKey는 개발자센터의 API 개별 연동 키 > 결제창 연동에 사용하려할 MID > 클라이언트 키로 바꾸세요.
-      // TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
-      // TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
-      // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
-      const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
-      const customerKey = generateRandomString();
-      const tossPayments = TossPayments(clientKey);
-      // 회원 결제
-      // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
-      const payment = tossPayments.payment({
-        customerKey,
-      });
+      // ------  SDK 초기화 (config 로드 후 실행) ------
+      // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
+      async function initTossPayments() {
+        const configRes = await fetch("/api/config");
+        const config = await configRes.json();
+        const clientKey = config.apiClientKey;
+        if (!clientKey) {
+          console.error("TOSSPAYMENTS_API_CLIENT_KEY가 .env에 설정되지 않았습니다.");
+        }
+        customerKey = generateRandomString();
+        tossPayments = TossPayments(clientKey);
+        payment = tossPayments.payment({ customerKey });
+      }
+
+      const paymentsReady = initTossPayments();
+      // 회원 결제 (payment는 initTossPayments에서 생성)
       // 비회원 결제
       // const payment = tossPayments.payment({customerKey: TossPayments.ANONYMOUS});
 
@@ -73,6 +95,7 @@
       // @docs https://docs.tosspayments.com/sdk/v2/js#paymentrequestpayment
       async function requestPayment() {
+        await paymentsReady;
         // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
         ...
-              orderName: "토스 티셔츠 외 2건",
+              orderName: orderName,
         (이하 모든 case에서 orderName: orderName 로 통일)
@@ -191,6 +204,7 @@
 
       async function requestBillingAuth() {
+        await paymentsReady;
         await payment.requestBillingAuth({
```

---

### public/brandpay/checkout.html

```diff
--- 3.sdk_api_official/public/brandpay/checkout.html
+++ 4.sdk_api2_mine/public/brandpay/checkout.html
@@ -23,24 +23,35 @@
     </div>
     <script>
-      // ------  SDK 초기화 ------
-      // TODO: clientKey는 개발자센터의 API 개별 연동 키 > 연동에 사용할 브랜드페이가 계약된 MID > 클라이언트 키로 바꾸세요.
-      // TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
-      // TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
-      // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
-      const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
-      const customerKey = generateRandomString();
-      const tossPayments = TossPayments(clientKey);
-      // 브랜드페이 객체 생성
-      // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentsbrandpay
-      const brandpay = tossPayments.brandpay({
-        customerKey,
-        // TODO: 개발자센터의 브랜드페이 > Redirect URL 에 아래 URL 을 추가하세요.
-        redirectUrl: "http://localhost:4000/callback-auth",
-      });
+      // ------  SDK 초기화 (config 로드 후 실행) ------
+      // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
+      let customerKey;
+      let brandpay;
+
+      // index 장바구니에서 넘어온 경우 sessionStorage 값 사용
+      const storedAmount = sessionStorage.getItem("paymentAmount");
+      const storedOrderName = sessionStorage.getItem("paymentOrderName");
+      const paymentAmount = storedAmount ? Number(storedAmount) : 50000;
+      const paymentOrderName = storedOrderName || "토스 티셔츠 외 2건";
+
+      const brandpayReady = (async function () {
+        const configRes = await fetch("/api/config");
+        const config = await configRes.json();
+        const clientKey = config.apiClientKey;
+        const baseUrl = config.baseUrl || window.location.origin;
+        if (!clientKey) {
+          console.error("TOSSPAYMENTS_API_CLIENT_KEY가 .env에 설정되지 않았습니다.");
+        }
+        customerKey = generateRandomString();
+        const tossPayments = TossPayments(clientKey);
+        brandpay = tossPayments.brandpay({
+          customerKey,
+          redirectUrl: baseUrl + "/callback-auth",
+        });
+      })();
 
       // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
       async function requestPayment() {
+        await brandpayReady;
         // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
         await brandpay.requestPayment({
           amount: {
             currency: "KRW",
-            value: 50000,
+            value: paymentAmount,
           },
           orderId: generateRandomString(), // 고유 주문번호
-          orderName: "토스 티셔츠 외 2건",
+          orderName: paymentOrderName,
           ...
         });
       }
 
       async function addPaymentMethod() {
+        await brandpayReady;
         await brandpay.addPaymentMethod();
       }
       (이하 changeOneTouchPay, changePassword, isOneTouchPayEnabled, openSettings 모두 맨 앞에 await brandpayReady; 추가)
```

---

## 5단계: 결제 승인 시 amount 숫자·에러 처리

### public/widget/success.html

```diff
--- 3.sdk_api_official/public/widget/success.html
+++ 4.sdk_api2_mine/public/widget/success.html
@@ -42,9 +42,9 @@
       const urlParams = new URLSearchParams(window.location.search);
 
-      // 서버로 결제 승인에 필요한 결제 정보를 보내세요.
+      // 서버로 결제 승인에 필요한 결제 정보를 보내세요. (amount는 숫자로 전달해야 토스 API에서 정상 처리됩니다)
       async function confirm() {
         var requestData = {
           paymentKey: urlParams.get("paymentKey"),
           orderId: urlParams.get("orderId"),
-          amount: urlParams.get("amount"),
+          amount: Number(urlParams.get("amount")) || 0,
         };
```

---

### public/payment/success.html

```diff
--- 3.sdk_api_official/public/payment/success.html
+++ 4.sdk_api2_mine/public/payment/success.html
@@ -42,9 +42,9 @@
       const urlParams = new URLSearchParams(window.location.search);
 
-      // 서버로 결제 승인에 필요한 결제 정보를 보내세요.
+      // 서버로 결제 승인에 필요한 결제 정보를 보내세요. (amount는 숫자로 전달)
       async function confirm() {
         var requestData = {
           paymentKey: urlParams.get("paymentKey"),
           orderId: urlParams.get("orderId"),
-          amount: urlParams.get("amount"),
+          amount: Number(urlParams.get("amount")) || 0,
         };
```

---

### public/brandpay/success.html

```diff
--- 3.sdk_api_official/public/brandpay/success.html
+++ 4.sdk_api2_mine/public/brandpay/success.html
@@ -42,10 +42,10 @@
       const urlParams = new URLSearchParams(window.location.search);
 
-      // 서버로 결제 승인에 필요한 결제 정보를 보내세요.
+      // 서버로 결제 승인에 필요한 결제 정보를 보내세요. (amount는 숫자로 전달)
       async function confirm() {
         var requestData = {
           paymentKey: urlParams.get("paymentKey"),
           orderId: urlParams.get("orderId"),
-          amount: urlParams.get("amount"),
+          amount: Number(urlParams.get("amount")) || 0,
           customerKey: urlParams.get("customerKey"),
         };
```

---

## 변경 없음

- **public/fail.html**
- **public/style.css**
- **public/payment/billing.html**

위 파일들은 `3.sdk_api_official`과 `4.sdk_api2_mine`에서 내용 동일합니다.

---

## 참고: 터미널에서 diff 확인

원본과 비교해 보고 싶을 때 (상위 폴더에서):

```bash
# 단일 파일
git diff --no-index -- 3.sdk_api_official/server.js 4.sdk_api2_mine/server.js

# 전체 디렉터리 (요약)
git diff --no-index --stat -- 3.sdk_api_official/ 4.sdk_api2_mine/
```
