-- 목적: EXPLAIN QUERY PLAN 맛보기
-- 인덱스 전/후로 계획이 달라질 수 있습니다.

EXPLAIN QUERY PLAN
SELECT
  u.Id, u.Name,
  SUM(oi.Qty * i.UnitPrice) AS spend
FROM users u
JOIN orders o ON o.UserId = u.Id
JOIN orderitems oi ON oi.OrderId = o.Id
JOIN items i ON i.Id = oi.ItemId
GROUP BY u.Id, u.Name
ORDER BY spend DESC;
