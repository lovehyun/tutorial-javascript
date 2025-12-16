-- 목적(실무 질문):
-- "고객별 최근구매일(Recency) / 방문수(Frequency) / 구매액(Monetary)을 보고 싶다."

WITH order_totals AS (
  SELECT
    o.Id AS order_id,
    o.UserId,
    o.OrderAt,
    SUM(oi.Qty * i.UnitPrice) AS order_total
  FROM orders o
  JOIN orderitems oi ON oi.OrderId = o.Id
  JOIN items i ON i.Id = oi.ItemId
  GROUP BY o.Id, o.UserId, o.OrderAt
),
rfm AS (
  SELECT
    UserId,
    MAX(OrderAt) AS last_order_at,
    COUNT(*) AS frequency,
    SUM(order_total) AS monetary
  FROM order_totals
  GROUP BY UserId
)
SELECT
  u.Id,
  u.Name,
  r.last_order_at,
  r.frequency,
  r.monetary
FROM users u
LEFT JOIN rfm r ON r.UserId = u.Id
ORDER BY r.monetary DESC;
