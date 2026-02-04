# 1.intro — Stripe 결제 가장 간단한 예제

금액 입력 → 결제하기 → Stripe 결제창 → 완료 시 success.html만 있는 최소 구성.

## 설정

```bash
cp .env.template .env
# .env에 STRIPE_SECRET_KEY 입력 (Stripe 대시보드에서 복사)
```

## 실행

```bash
npm install
npm start
```

브라우저에서 http://localhost:3000 → 금액 입력 후 결제하기. 테스트 카드: 4242 4242 4242 4242
