-- 목적: 주문별 총액(라인아이템 합산)

SELECT
  o.Id AS order_id,
  o.OrderAt,
  SUM(oi.Qty * i.UnitPrice) AS order_total
FROM orders o
JOIN orderitems oi ON oi.OrderId = o.Id
JOIN items i ON i.Id = oi.ItemId
GROUP BY o.Id, o.OrderAt
ORDER BY o.OrderAt;
