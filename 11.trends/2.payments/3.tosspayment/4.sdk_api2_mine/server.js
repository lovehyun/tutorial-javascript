require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(express.json());

// 시크릿 키는 .env에서 로드 (env.template 참고)
const widgetSecretKey = process.env.TOSSPAYMENTS_WIDGET_SECRET_KEY;
const apiSecretKey = process.env.TOSSPAYMENTS_API_SECRET_KEY;

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
const encryptedWidgetSecretKey =
  widgetSecretKey ? "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64") : "";
const encryptedApiSecretKey =
  apiSecretKey ? "Basic " + Buffer.from(apiSecretKey + ":").toString("base64") : "";

// 클라이언트용 공개 설정 (클라이언트 키만 노출, 시크릿 키는 제외)
app.get("/api/config", function (req, res) {
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  res.json({
    widgetClientKey: process.env.TOSSPAYMENTS_WIDGET_CLIENT_KEY || "",
    apiClientKey: process.env.TOSSPAYMENTS_API_CLIENT_KEY || "",
    baseUrl,
  });
});

// 결제 승인 공통: 토스 API는 amount를 숫자로 받음. 시크릿 키 없으면 승인 불가(개발자 포털에 기록 안 남음)
function requireWidgetSecret(req, res, next) {
  if (!encryptedWidgetSecretKey) {
    console.error("[결제 승인 실패] TOSSPAYMENTS_WIDGET_SECRET_KEY가 .env에 없습니다. 개발자 포털에 결제 이력이 남지 않습니다.");
    return res.status(500).json({ code: "MISSING_SECRET", message: "서버에 위젯 시크릿 키가 설정되지 않았습니다. .env를 확인하세요." });
  }
  next();
}

// 결제위젯 승인
app.post("/confirm/widget", requireWidgetSecret, function (req, res) {
  const { paymentKey, orderId, amount } = req.body;
  const amountNum = Number(amount);
  if (!paymentKey || !orderId || !amount || isNaN(amountNum)) {
    return res.status(400).json({ code: "INVALID_BODY", message: "paymentKey, orderId, amount가 필요합니다." });
  }

  fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: encryptedWidgetSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      amount: amountNum,
      paymentKey,
    }),
  })
    .then(async function (response) {
      const result = await response.json();
      console.log("[위젯 승인 응답]", response.status, result);
      if (!response.ok) {
        return res.status(response.status).json(result);
      }
      res.status(response.status).json(result);
    })
    .catch(function (err) {
      console.error("[위젯 승인 오류]", err);
      res.status(500).json({ code: "SERVER_ERROR", message: err.message || "결제 승인 요청 중 오류가 났습니다." });
    });
});

// 결제창 승인
function requireApiSecret(req, res, next) {
  if (!encryptedApiSecretKey) {
    console.error("[결제 승인 실패] TOSSPAYMENTS_API_SECRET_KEY가 .env에 없습니다.");
    return res.status(500).json({ code: "MISSING_SECRET", message: "서버에 API 시크릿 키가 설정되지 않았습니다. .env를 확인하세요." });
  }
  next();
}

app.post("/confirm/payment", requireApiSecret, function (req, res) {
  const { paymentKey, orderId, amount } = req.body;
  const amountNum = Number(amount);
  if (!paymentKey || !orderId || !amount || isNaN(amountNum)) {
    return res.status(400).json({ code: "INVALID_BODY", message: "paymentKey, orderId, amount가 필요합니다." });
  }

  fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      amount: amountNum,
      paymentKey,
    }),
  })
    .then(async function (response) {
      const result = await response.json();
      console.log("[결제창 승인 응답]", response.status, result);
      if (!response.ok) {
        return res.status(response.status).json(result);
      }
      res.status(response.status).json(result);
    })
    .catch(function (err) {
      console.error("[결제창 승인 오류]", err);
      res.status(500).json({ code: "SERVER_ERROR", message: err.message || "결제 승인 요청 중 오류가 났습니다." });
    });
});

// 브랜드페이 승인
app.post("/confirm/brandpay", requireApiSecret, function (req, res) {
  const { paymentKey, orderId, amount, customerKey } = req.body;
  const amountNum = Number(amount);
  if (!paymentKey || !orderId || !amount || isNaN(amountNum)) {
    return res.status(400).json({ code: "INVALID_BODY", message: "paymentKey, orderId, amount, customerKey가 필요합니다." });
  }

  fetch("https://api.tosspayments.com/v1/brandpay/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      amount: amountNum,
      paymentKey,
      customerKey,
    }),
  })
    .then(async function (response) {
      const result = await response.json();
      console.log("[브랜드페이 승인 응답]", response.status, result);
      if (!response.ok) {
        return res.status(response.status).json(result);
      }
      res.status(response.status).json(result);
    })
    .catch(function (err) {
      console.error("[브랜드페이 승인 오류]", err);
      res.status(500).json({ code: "SERVER_ERROR", message: err.message || "결제 승인 요청 중 오류가 났습니다." });
    });
});

// 브랜드페이 Access Token 발급
app.get("/callback-auth", function (req, res) {
  const { customerKey, code } = req.query;

  // 요청으로 받은 customerKey 와 요청한 주체가 동일인인지 검증 후 Access Token 발급 API 를 호출하세요.
  // @docs https://docs.tosspayments.com/reference/brandpay#access-token-발급
  fetch("https://api.tosspayments.com/v1/brandpay/authorizations/access-token", {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grantType: "AuthorizationCode",
      customerKey,
      code,
    }),
  }).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 발급 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 발급 성공 비즈니스 로직을 구현하세요.
    res.status(response.status).json(result);
  });
});

const billingKeyMap = new Map();

// 빌링키 발급
app.post("/issue-billing-key", function (req, res) {
  const { customerKey, authKey } = req.body;

  // AuthKey 로 카드 빌링키 발급 API 를 호출하세요
  // @docs https://docs.tosspayments.com/reference#authkey로-카드-빌링키-발급
  fetch(`https://api.tosspayments.com/v1/billing/authorizations/issue`, {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerKey,
      authKey,
    }),
  }).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 빌링키 발급 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 빌링키 발급 성공 비즈니스 로직을 구현하세요.
    // TODO: 발급된 빌링키를 구매자 정보로 찾을 수 있도록 저장해두고, 결제가 필요한 시점에 조회하여 카드 자동결제 승인 API 를 호출합니다.
    billingKeyMap.set(customerKey, result.billingKey);
    res.status(response.status).json(result);
  });
});

// 카드 자동결제 승인
app.post("/confirm-billing", function (req, res) {
  const { customerKey, amount, orderId, orderName, customerEmail, customerName } = req.body;

  // 저장해두었던 빌링키로 카드 자동결제 승인 API 를 호출하세요.
  fetch(`https://api.tosspayments.com/v1/billing/${billingKeyMap.get(customerKey)}`, {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerKey,
      amount,
      orderId,
      orderName,
      customerEmail,
      customerName,
    }),
  }).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 자동결제 승인 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 자동결제 승인 성공 비즈니스 로직을 구현하세요.
    res.status(response.status).json(result);
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port} 으로 샘플 앱이 실행되었습니다.`);
  if (!widgetSecretKey) console.warn("[경고] TOSSPAYMENTS_WIDGET_SECRET_KEY가 없습니다. 위젯 결제 승인 시 개발자 포털에 이력이 남지 않습니다.");
  if (!apiSecretKey) console.warn("[경고] TOSSPAYMENTS_API_SECRET_KEY가 없습니다. 결제창/브랜드페이 승인 시 개발자 포털에 이력이 남지 않습니다.");
});
