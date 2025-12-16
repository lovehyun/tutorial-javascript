-- 목적: 매장별 매출

SELECT
  s.Id AS store_id,
  s.Name AS store_name,
  COALESCE(SUM(oi.Qty * i.UnitPrice), 0) AS revenue
FROM stores s
LEFT JOIN orders o ON o.StoreId = s.Id
LEFT JOIN orderitems oi ON oi.OrderId = o.Id
LEFT JOIN items i ON i.Id = oi.ItemId
GROUP BY s.Id, s.Name
ORDER BY revenue DESC;
