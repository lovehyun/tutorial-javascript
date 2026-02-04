# 원본 코드 → 현재 구조로의 변경 이력

원본 토스페이먼츠 Express + JavaScript 샘플에서, 아래 목표를 위해 **순서대로** 적용했던 변경 사항을 정리한 문서입니다.

---

## 목표 정리

1. **민감 정보 분리**: 시크릿/클라이언트 키를 코드에서 빼고 `.env`로 관리
2. **실제 주문 반영**: 하드코딩된 상품·금액 대신 장바구니 기반 결제
3. **결제 수단 선택**: 위젯 / 일반 결제창 / 브랜드페이 중 사용자가 선택
4. **결제 승인 안정화**: 서버 승인 API가 정상 동작해 개발자 포털에 이력 남기기

---

## 원본 상태 (변경 전)

- **server.js**: `widgetSecretKey`, `apiSecretKey`가 문자열로 하드코딩
- **위젯/결제창/브랜드페이 checkout.html**: `clientKey` 하드코딩
- **결제 금액·주문명**: 50,000원, "토스 티셔츠 외 2건" 등 고정값
- **진입점**: 결제위젯/결제창/브랜드페이 페이지를 직접 열어서 테스트하는 구조

---

# 1단계: 민감 키를 .env로 분리

## 1-1. 목적

- 시크릿 키·클라이언트 키를 코드에 두지 않고 환경 변수로 관리
- 저장소에 올릴 때 키가 노출되지 않도록 `.env`는 `.gitignore`에 포함
- 다른 환경(로컬/스테이징/운영)마다 다른 키를 쓰기 쉽게 함

## 1-2. 추가한 파일

| 파일 | 역할 |
|------|------|
| **env.template** | 사용할 환경 변수 **키 이름**만 정의. 값은 비움. 복사해서 `.env` 만들 때 참고 |
| **.env** | 실제 키 값 저장. `cp env.template .env` 후 개발자 포털에서 발급한 키 입력 |
| **.gitignore** | `node_modules/`, `.env` 추가 → `.env`는 커밋 대상에서 제외 |

## 1-3. 수정한 파일

### package.json

- **추가**: 의존성 `"dotenv": "^16.4.5"`
- 서버 기동 시 `.env`를 읽으려면 `dotenv` 필요

### server.js

- **맨 위**: `require("dotenv").config();` 추가
- **포트**: `const port = 4000` → `const port = process.env.PORT || 4000`
- **시크릿 키**:  
  `const widgetSecretKey = "test_gsk_...";`  
  → `const widgetSecretKey = process.env.TOSSPAYMENTS_WIDGET_SECRET_KEY;`  
  (apiSecretKey도 동일하게 `TOSSPAYMENTS_API_SECRET_KEY` 로 읽기)
- **Basic 인증 문자열**: 키가 없을 때 빈 문자열이 되도록  
  `widgetSecretKey ? "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64") : ""`
- **신규 라우트**: `GET /api/config`  
  - 응답: `{ widgetClientKey, apiClientKey, baseUrl }`  
  - 시크릿 키는 절대 포함하지 않음  
  - 프론트엔드가 클라이언트 키만 안전하게 받기 위한 용도

### public/widget/checkout.html

- **변경 전**: `const clientKey = "test_gck_docs_...";`
- **변경 후**:  
  `const configRes = await fetch("/api/config");`  
  `const config = await configRes.json();`  
  `const clientKey = config.widgetClientKey;`

### public/payment/checkout.html

- **변경 전**: 스크립트 로드 시 바로 `const clientKey = "test_ck_...";` 로 TossPayments 초기화
- **변경 후**:  
  - `initTossPayments()` 비동기 함수에서 `fetch("/api/config")` 후 `config.apiClientKey` 사용  
  - `const paymentsReady = initTossPayments();` 로 한 번만 실행  
  - `requestPayment()`, `requestBillingAuth()` 맨 앞에 `await paymentsReady;` 추가  
  → 결제/빌링 버튼을 눌렀을 때 이미 초기화가 끝나 있도록 보장

### public/brandpay/checkout.html

- **변경 전**: `const clientKey = "test_ck_...";`, `redirectUrl: "http://localhost:4000/callback-auth"` 고정
- **변경 후**:  
  - `fetch("/api/config")` → `config.apiClientKey`, `config.baseUrl` 사용  
  - `redirectUrl: baseUrl + "/callback-auth"`  
  - 초기화를 `brandpayReady` Promise로 한 번만 수행  
  - `requestPayment`, `addPaymentMethod` 등 모든 브랜드페이 버튼에서 `await brandpayReady;` 후 호출

### README.md

- 실행 절차에 "env.template 복사 → .env 생성 후 키 입력" 단계 추가
- 인증 섹션을 "모든 API 키는 .env에서" 로 바꾸고, env 키 표 추가
- 샘플 링크 표에 상품 목록·장바구니(메인 진입점) 설명 추가

## 1-4. 유의사항

- **클라이언트 키**는 브라우저에 노출되어도 되는 값이지만, 키를 코드에 박지 않고 `/api/config`로 전달하면 키 교체·환경 분리가 쉬움
- **시크릿 키**는 `/api/config`에 넣지 말 것. 서버에서 결제 승인 API 호출할 때만 사용

---

# 2단계: 상품 목록·장바구니·결제하기 (index.html)

## 2-1. 목적

- 하드코딩된 "50,000원 / 토스 티셔츠 외 2건" 대신, 사용자가 고른 상품과 금액이 결제에 반영되도록 함

## 2-2. 추가한 파일

| 파일 | 역할 |
|------|------|
| **public/index.html** | 메인 진입 페이지. 상품 3개(1,000원 / 1,500원 / 2,000원), 장바구니(담기·수량 ±), 총액, 결제하기 버튼 |

## 2-3. 동작 흐름

1. 상품 카드에서 "담기" → 장바구니에 수량 추가
2. 장바구니 테이블에서 + / − 로 수량 변경, 소계·총 결제 금액 표시
3. "결제하기" 클릭 시  
   - `sessionStorage`에 `paymentAmount`(총액), `paymentOrderName`(예: "상품 A 2개, 상품 B 1개") 저장  
   - 당시에는 곧바로 `/widget/checkout.html`로 이동 (3단계에서 선택 화면으로 변경)

## 2-4. 수정한 파일

### public/widget/checkout.html

- 페이지 로드 시 `sessionStorage.getItem("paymentAmount")`, `sessionStorage.getItem("paymentOrderName")` 확인
- 있으면: `amount.value`, `orderName`으로 사용  
  없으면: 기존처럼 50,000원, "토스 티셔츠 외 2건"
- `requestPayment` 호출 시 위에서 정한 `orderName` 변수 사용

## 2-5. 유의사항

- `sessionStorage`는 같은 탭·같은 도메인에서만 유지됨. 새 탭에서 결제창을 열면 유지됨
- 금액·주문명은 반드시 서버 승인 단계에서도 검증하는 것이 안전함 (현재 샘플은 클라이언트 → 서버로 그대로 전달)

---

# 3단계: 결제 수단 선택 (위젯 / 일반 / 브랜드페이)

## 3-1. 목적

- "결제하기"를 누르면 **어떤 결제 모듈으로 갈지** 사용자가 선택
- 선택한 모듈에서 모두 **같은 장바구니 정보**(금액·주문명)를 쓰도록 함

## 3-2. 수정한 파일

### public/index.html

- **변경 전**: "결제하기" 클릭 → sessionStorage 저장 후 곧바로 `location.href = "/widget/checkout.html"`
- **변경 후**:  
  1. "결제하기" 클릭 → sessionStorage에 `paymentAmount`, `paymentOrderName` 저장  
  2. **결제 수단 선택** 영역 표시 (기존에는 숨김)  
  3. 버튼 3개: **위젯으로 결제** → `/widget/checkout.html`  
                 **일반 결제창으로 결제** → `/payment/checkout.html`  
                 **브랜드페이로 결제** → `/brandpay/checkout.html`  
  4. **취소** 버튼 → 선택 영역만 숨김 (장바구니 유지)

### public/payment/checkout.html

- 스크립트 상단에서 `sessionStorage.getItem("paymentAmount")`, `sessionStorage.getItem("paymentOrderName")` 읽기
- `amountValue = storedAmount ? Number(storedAmount) : 50000`  
  `orderName = storedOrderName || "토스 티셔츠 외 2건"`
- `amount = { currency: "KRW", value: amountValue }`
- 모든 결제 수단(CARD, TRANSFER, VIRTUAL_ACCOUNT 등)의 `requestPayment` 호출에서  
  `orderName: "토스 티셔츠 외 2건"` → `orderName: orderName` 으로 변경

### public/brandpay/checkout.html

- 스크립트 상단에서 `sessionStorage` 로 `paymentAmount`, `paymentOrderName` 읽기
- `requestPayment` 호출 시  
  `amount: { currency: "KRW", value: paymentAmount }`,  
  `orderName: paymentOrderName`  
  사용 (없으면 50,000 / "토스 티셔츠 외 2건")

## 3-3. 유의사항

- 위젯은 "결제위젯 연동 키", 일반/브랜드페이는 "API 개별 연동 키"를 쓰므로 `.env`에 두 세트 모두 필요
- index에서 담은 장바구니는 **세 결제 모듈에 동일한 금액·주문명**으로 전달됨

---

# 4단계: 취소 버튼 디자인 통일

## 4-1. 목적

- "결제 수단 선택" 아래 **취소** 버튼이 너무 작고 스타일이 없어 보이던 부분 개선

## 4-2. 수정한 파일

### public/index.html

- **취소** 버튼에 인라인 스타일 제거, `btn-cancel` 클래스 적용
- `<style>` 안에 `.btn-cancel` 정의:  
  - 패딩·폰트 크기·굵기를 결제 버튼과 비슷하게  
  - 배경 회색(`grey200`), 호버 시 조금 더 진한 회색  
  - `border-radius: 7px`, `cursor: pointer`

---

# 5단계: 결제 승인 안정화 (서버·클라이언트)

## 5-1. 목적

- "결제 완료" 화면은 뜨는데 **개발자 포털에 결제 이력이 안 남는** 문제 해결
- 원인:  
  - 서버가 토스 **결제 승인 API**를 호출할 때 실패하거나,  
  - 시크릿 키 누락·`amount` 타입 오류 등으로 승인이 완료되지 않음

## 5-2. 결제 승인 흐름 (이해용)

1. 사용자가 토스 결제창에서 결제 완료
2. 토스가 `successUrl`로 리다이렉트 (예: `?paymentKey=...&orderId=...&amount=...`)
3. **success 페이지**가 이 파라미터를 받아 **우리 서버**의 `/confirm/widget` 또는 `/confirm/payment`, `/confirm/brandpay` 호출
4. **서버**가 토스 API `POST /v1/payments/confirm` (또는 브랜드페이용 confirm) 호출
5. 토스가 **200 + status: 'DONE'** 으로 응답하면 → **그 시점에 최종 승인 완료** → 개발자 포털에 기록됨

즉, "결제 완료" 문구는 URL만 있어도 뜨고, **실제 확정**은 서버의 결제 승인 API 성공 여부에 따름.

## 5-3. 수정한 파일

### server.js

- **amount 타입**  
  - 토스 API는 `amount`를 **숫자**로 받음  
  - `/confirm/widget`, `/confirm/payment`, `/confirm/brandpay` 모두  
    `amountNum = Number(amount)` 후  
    `body: JSON.stringify({ ..., amount: amountNum, ... })` 로 전달

- **시크릿 키 검사**  
  - `requireWidgetSecret`, `requireApiSecret` 미들웨어 추가  
  - 위젯 승인: 시크릿 키 없으면 500 + `MISSING_SECRET` 반환, 콘솔 에러 로그  
  - 결제창/브랜드페이 승인: API 시크릿 키 없으면 동일 처리

- **필수 파라미터 검사**  
  - `paymentKey`, `orderId`, `amount` 없거나 `amount`가 숫자로 변환 불가면 400 + `INVALID_BODY`

- **fetch 실패 처리**  
  - `.catch()` 추가: 네트워크 오류 등으로 토스 API 호출이 실패해도  
    클라이언트에 500 + 메시지 반환 (그전에는 응답이 안 가서 멈춘 것처럼 보일 수 있었음)

- **로그**  
  - 승인 요청 시 `[위젯 승인 응답]`, `[결제창 승인 응답]`, `[브랜드페이 승인 응답]` + 상태 코드·응답 본문 로그

- **서버 기동 시**  
  - 시크릿 키가 없으면 콘솔에 경고 메시지 출력  
  - "위젯/API 시크릿 키가 없으면 개발자 포털에 이력이 남지 않습니다" 안내

### public/widget/success.html, payment/success.html, brandpay/success.html

- 서버로 보낼 때 **amount를 숫자**로 전달  
  - `amount: urlParams.get("amount")`  
  → `amount: Number(urlParams.get("amount")) || 0`  
- 토스 API 규격에 맞추고, 서버에서 `Number(amount)`가 NaN이 되지 않도록 함

## 5-4. 유의사항

- **200 + status: 'DONE'** 이 오면 그 결제는 **최종 승인 완료**된 것이며, 별도 "한 번 더 승인" 단계는 없음
- 개발자 포털에 이력이 안 보이면:  
  1) `.env`에 **본인 개발자 포털에서 발급한** 시크릿/클라이언트 키가 들어갔는지 확인  
  2) 서버 터미널에서 `[결제창 승인 응답]` 등 로그와 상태 코드 확인  
  3) 실패 시 토스 응답의 `code`, `message`로 원인 파악

---

# 변경 이력 요약 (순서대로)

| 순서 | 단계 | 요약 |
|------|------|------|
| 1 | 민감 키 분리 | .env, env.template, .gitignore 추가. server.js에서 env 읽기, GET /api/config. 프론트는 /api/config로 clientKey 사용 |
| 2 | 장바구니·결제 | index.html 추가(상품 3종, 장바구니 ±, 총액). 결제하기 → sessionStorage 저장 후 위젯으로 이동. widget/checkout에서 sessionStorage 금액·주문명 사용 |
| 3 | 결제 수단 선택 | index에서 결제하기 클릭 시 위젯/일반/브랜드페이 중 선택. payment·brandpay checkout에서도 sessionStorage 금액·주문명 사용 |
| 4 | UI 보완 | index 취소 버튼에 .btn-cancel 스타일 적용 |
| 5 | 결제 승인 안정화 | server: amount 숫자 전달, 시크릿 키 검사, fetch .catch, 로그·기동 시 경고. success 페이지들: amount 숫자로 전달 |

---

# 파일별 변경 요약

| 파일 | 변경 내용 |
|------|-----------|
| **package.json** | dotenv 의존성 추가 |
| **server.js** | dotenv, PORT·시크릿 키 env화, GET /api/config, 결제 승인 시 amount 숫자·키 검사·catch·로그·기동 경고 |
| **env.template** | (신규) 환경 변수 키만 정의 |
| **.env** | (신규) 실제 키 값. .gitignore 대상 |
| **.gitignore** | (신규) node_modules/, .env |
| **public/index.html** | (신규) 상품·장바구니·결제 수단 선택·취소 버튼 스타일 |
| **public/widget/checkout.html** | /api/config로 clientKey, sessionStorage로 amount·orderName |
| **public/widget/success.html** | 서버로 보낼 amount를 Number로 |
| **public/payment/checkout.html** | /api/config, initTossPayments·paymentsReady, sessionStorage amount·orderName, 모든 requestPayment에 orderName 변수 |
| **public/payment/success.html** | 서버로 보낼 amount를 Number로 |
| **public/brandpay/checkout.html** | /api/config, baseUrl, brandpayReady, sessionStorage amount·orderName |
| **public/brandpay/success.html** | 서버로 보낼 amount를 Number로 |
| **README.md** | 실행 절차·env 설명·샘플 링크 표·추가로 뽑아낼 고정값 안내 |

---

# 복습 시 체크리스트

- [ ] .env에 넣는 키 4종(위젯 시크릿/클라이언트, API 시크릿/클라이언트) 역할 구분
- [ ] 클라이언트 키는 /api/config로만 전달하고, 시크릿 키는 서버 결제 승인 시에만 사용하는 이유
- [ ] 장바구니 → 결제하기 → 결제 수단 선택 → 각 checkout 페이지로 가는 흐름
- [ ] sessionStorage에 paymentAmount, paymentOrderName을 넣고, 세 결제 모듈에서 공통으로 쓰는 구조
- [ ] "결제 완료" 화면과 "실제 승인 완료(포털에 기록)"의 차이 → 서버의 결제 승인 API 성공 여부
- [ ] 토스 API에 amount를 숫자로 보내야 하고, 시크릿 키가 없으면 승인이 실패한다는 점

이 문서는 원본 대비 **어떤 순서로 무엇을 바꿨는지** 복습할 때 참고하면 됩니다.
