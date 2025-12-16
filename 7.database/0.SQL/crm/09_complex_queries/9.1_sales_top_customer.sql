-- 목적(실무 질문):
-- "우리 상점에서 가장 많은 상품을 구매한 고객(매출 1위 고객)은 누구인가?"

WITH user_revenue AS (
  SELECT
    u.Id AS user_id,
    u.Name AS user_name,
    SUM(oi.Qty) AS total_qty,
    SUM(oi.Qty * i.UnitPrice) AS revenue
  FROM users u
  JOIN orders o ON o.UserId = u.Id
  JOIN orderitems oi ON oi.OrderId = o.Id
  JOIN items i ON i.Id = oi.ItemId
  GROUP BY u.Id, u.Name
)
SELECT *
FROM user_revenue
ORDER BY revenue DESC
LIMIT 1;
