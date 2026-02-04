import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT ?? 3000;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is required. Copy .env.template to .env and set your key.");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

app.use(express.json());

// ——— API (JSON 요청/응답) ———
// POST /api/checkout — body: { amount }(원), 응답: { url } 또는 { error }
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
      success_url: `${req.protocol}://${req.get("host")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Checkout session failed" });
  }
});

// GET /api/payments — 결제 완료된 세션 목록, 응답: { payments: [{ id, amount_total, currency, created }] }
app.get("/api/payments", async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const { data } = await stripe.checkout.sessions.list({
      status: "complete",
      limit,
    });
    const payments = data.map((s) => ({
      id: s.id,
      amount_total: s.amount_total ?? 0,
      currency: s.currency ?? "krw",
      created: s.created,
    }));
    res.json({ payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Failed to list payments" });
  }
});

// POST /api/refund — body: { session_id }, 해당 결제 전액 환불
app.post("/api/refund", async (req, res) => {
  try {
    const sessionId = req.body?.session_id;
    if (!sessionId) {
      return res.status(400).json({ error: "session_id 필요" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntent = session.payment_intent;
    if (!paymentIntent) {
      return res.status(400).json({ error: "결제 정보를 찾을 수 없음" });
    }
    const pi = typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
    await stripe.refunds.create({ payment_intent: pi });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "환불 처리 실패" });
  }
});

// ——— 페이지 (HTML, 라우트로 제공) ———
app.get("/success", (req, res) => res.sendFile(path.join(__dirname, "public", "success.html")));
app.get("/cancel", (req, res) => res.sendFile(path.join(__dirname, "public", "cancel.html")));
app.get("/failure", (req, res) => res.sendFile(path.join(__dirname, "public", "failure.html")));
app.get("/payments", (req, res) => res.sendFile(path.join(__dirname, "public", "payments.html")));

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
