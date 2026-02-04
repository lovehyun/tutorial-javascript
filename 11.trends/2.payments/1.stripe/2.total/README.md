# Stripe 결제 예제 (Node.js + Express)

## 설정

1. `.env.template`을 복사해 `.env` 생성  
2. [Stripe 대시보드](https://dashboard.stripe.com/apikeys)에서 시크릿 키 복사 후 `.env`의 `STRIPE_SECRET_KEY`에 입력  

```bash
cp .env.template .env
# .env 편집 → STRIPE_SECRET_KEY=sk_test_...
```

## 실행

```bash
npm install
npm start
```

브라우저에서 http://localhost:3000 접속 후 "결제하기"로 테스트 (테스트 카드: 4242 4242 4242 4242).
