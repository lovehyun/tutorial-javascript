# 토스페이먼츠 Express + JavaScript 샘플 프로젝트

토스페이먼츠 JavaScript SDK로 결제 과정을 구현한 Express + JavaScript 샘플 프로젝트입니다. 자세한 연동 방법과 결제 과정은 [공식 연동 문서](https://docs.tosspayments.com/guides/v2/get-started)에서 확인하세요.

## 준비하기

샘플 프로젝트를 사용하려면 [Node.js](https://nodejs.org/ko/) 18.0.0 이상의 버전이 필요합니다. 먼저 내 컴퓨터의 Node.js 버전을 확인하세요. Node.js가 없다면 [Node.js 홈페이지](https://nodejs.org/ko/download/)에서 다운로드하거나 [nvm](https://github.com/nvm-sh/nvm#about)(Node Version Manager)을 사용해서 설치하세요.

```sh
$ node -v
$ v18.18.2
```

## 실행하기

1. 샘플 프로젝트 레포지토리를 클론(Clone)하고 프로젝트 폴더로 진입하세요.

   ```sh
   $ git clone <repository-url>
   $ cd 4.sdk_api2_mine
   ```

2. 환경 변수 설정: `env.template`을 복사해 `.env` 파일을 만들고, [개발자센터](https://developers.tosspayments.com/my/api-keys)에서 발급한 키를 입력하세요. (미설정 시 샘플용 테스트 키가 하드코딩된 값으로 동작하지 않을 수 있습니다.)

   ```sh
   $ cp env.template .env
   # .env 파일을 열어 TOSSPAYMENTS_* 키 값을 입력하세요.
   ```

3. 의존성 패키지를 다운로드하고 서버를 실행합니다.

   ```sh
   $ npm install
   $ npm start
   ```

4. 로컬 환경에서 샘플 프로젝트를 확인하세요.

| 페이지 | 링크 |
|--------|------|
| **상품 목록·장바구니** (결제하기 → 위젯 결제) | http://localhost:4000/ 또는 http://localhost:4000/index.html |
| 결제위젯 | http://localhost:4000/widget/checkout.html |
| 결제창(일반결제/정기결제) | http://localhost:4000/payment/checkout.html |
| 브랜드페이 | http://localhost:4000/brandpay/checkout.html |

## 인증하기

모든 API 키는 `.env` 파일에서 관리합니다. `env.template`을 복사해 `.env`를 만든 뒤 [개발자센터](https://developers.tosspayments.com/my/api-keys)에서 발급한 키를 입력하세요. 더 자세한 내용은 [API 키 가이드](https://docs.tosspayments.com/reference/using-api/api-keys)를 참고하세요.

| env 키 | 설명 |
|--------|------|
| `TOSSPAYMENTS_WIDGET_SECRET_KEY` | 결제위젯 시크릿 키 (서버 전용, 노출 금지) |
| `TOSSPAYMENTS_WIDGET_CLIENT_KEY` | 결제위젯 클라이언트 키 |
| `TOSSPAYMENTS_API_SECRET_KEY` | API 개별 연동 시크릿 키 (서버 전용, 노출 금지) |
| `TOSSPAYMENTS_API_CLIENT_KEY` | API 개별 연동 클라이언트 키 (결제창/브랜드페이) |
| `PORT` | 서버 포트 (기본 4000) |

\* 시크릿 키는 외부에 절대 노출되면 안 됩니다. `.env`는 `.gitignore`에 포함되어 있어 저장소에 올라가지 않습니다.

- **브랜드페이**
  - 브랜드페이를 테스트하고 싶다면 반드시 클라이언트 키, 시크릿 키를 내 키로 바꿔주세요.
  - 개발자센터의 브랜드페이 메뉴에서 리다이렉트 URL도 반드시 등록해야 됩니다. `public/brandpay/checkout.html` 파일을 참고해주세요.

## 추가로 뽑아낼 수 있는 고정값 (선택)

실서비스 연동 시 아래 값들도 설정/DB/입력값으로 빼두는 것을 권장합니다.

| 위치 | 고정값 | 설명 |
|------|--------|------|
| 위젯/결제창/브랜드페이 | `customerEmail: "customer123@gmail.com"` | 결제자 이메일 (실제로는 로그인 사용자 또는 입력값) |
| 위젯/결제창/브랜드페이 | `customerName: "김토스"` | 결제자 이름 |
| 위젯 (쿠폰) | `5000` (쿠폰 할인액) | 위젯 페이지의 "5,000원 쿠폰" 고정값 |
| 결제창/브랜드페이 직접 접속 시 | `amount: 50000`, `orderName: "토스 티셔츠 외 2건"` | sessionStorage 없을 때 쓰는 기본 금액·주문명 |
| payment/billing.html | `customerEmail`, `customerName` | 빌링키 발급/자동결제 시 구매자 정보 |

index.html에서 결제하기로 넘길 때는 **금액·주문명**이 장바구니 기준으로 sessionStorage에 담겨 위젯으로 전달됩니다.

## 더 알아보기

- [토스페이먼츠 공식 문서](https://docs.tosspayments.com/guides/v2/get-started)
- [1:1 채팅(Discord)](https://discord.com/invite/VdkfJnknD9)
