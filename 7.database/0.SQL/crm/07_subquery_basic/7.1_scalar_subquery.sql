-- 목적: 스칼라 서브쿼리(단일 값)로 평균보다 큰 주문 찾기

WITH order_totals AS (
  SELECT o.Id AS order_id,
         SUM(oi.Qty * i.UnitPrice) AS order_total
  FROM orders o
  JOIN orderitems oi ON oi.OrderId = o.Id
  JOIN items i ON i.Id = oi.ItemId
  GROUP BY o.Id
)
SELECT *
FROM order_totals
WHERE order_total > (SELECT AVG(order_total) FROM order_totals)
ORDER BY order_total DESC;
