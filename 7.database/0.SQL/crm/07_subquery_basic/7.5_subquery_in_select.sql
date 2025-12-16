-- 목적: SELECT 컬럼에 서브쿼리(행마다 계산값 붙이기)

SELECT
  u.Id,
  u.Name,
  (SELECT COUNT(*) FROM orders o WHERE o.UserId = u.Id) AS order_cnt,
  (SELECT COALESCE(SUM(oi.Qty * i.UnitPrice),0)
   FROM orders o
   JOIN orderitems oi ON oi.OrderId = o.Id
   JOIN items i ON i.Id = oi.ItemId
   WHERE o.UserId = u.Id) AS total_spend
FROM users u
ORDER BY total_spend DESC;
