-- 목적: 고객별 누적 구매액(매출 기준 Top 고객의 기반 데이터)

SELECT
  u.Id AS user_id,
  u.Name AS user_name,
  COALESCE(SUM(oi.Qty * i.UnitPrice), 0) AS total_spend
FROM users u
LEFT JOIN orders o ON o.UserId = u.Id
LEFT JOIN orderitems oi ON oi.OrderId = o.Id
LEFT JOIN items i ON i.Id = oi.ItemId
GROUP BY u.Id, u.Name
ORDER BY total_spend DESC;
