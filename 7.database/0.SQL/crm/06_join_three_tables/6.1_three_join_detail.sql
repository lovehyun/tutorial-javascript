-- 목적: 주문 상세(라인아이템) 보기: orders + orderitems + items

SELECT
  o.Id AS order_id,
  o.OrderAt,
  oi.Id AS orderitem_id,
  i.Name AS item_name,
  oi.Qty,
  i.UnitPrice,
  (oi.Qty * i.UnitPrice) AS line_total
FROM orders o
JOIN orderitems oi ON oi.OrderId = o.Id
JOIN items i ON i.Id = oi.ItemId
ORDER BY o.OrderAt, oi.Id;
