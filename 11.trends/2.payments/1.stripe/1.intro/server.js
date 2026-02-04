import "dotenv/config";
import express from "express";
import Stripe from "stripe";

const app = express();
const PORT = process.env.PORT ?? 3000;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY가 필요합니다. .env.template을 .env로 복사한 뒤 키를 설정하세요.");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

app.use(express.json());
app.use(express.static("public"));

app.post("/api/checkout", async (req, res) => {
  try {
    const amount = Math.max(100, Number(req.body?.amount) || 10000);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "krw",
            product_data: {
              name: "예제 상품",
              description: `결제 금액 ${amount.toLocaleString("ko-KR")}원`,
            },
            unit_amount: amount,
          },
        },
      ],
      success_url: `${req.protocol}://${req.get("host")}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get("host")}/`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "결제 세션 생성 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
