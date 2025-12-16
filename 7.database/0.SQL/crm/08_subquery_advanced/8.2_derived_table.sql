-- 목적: 파생테이블로 매장별 매출 계산 후 TOP 매장 찾기

SELECT s.Id, s.Name, t.revenue
FROM stores s
JOIN (
  SELECT o.StoreId, SUM(oi.Qty * i.UnitPrice) AS revenue
  FROM orders o
  JOIN orderitems oi ON oi.OrderId = o.Id
  JOIN items i ON i.Id = oi.ItemId
  GROUP BY o.StoreId
) t ON t.StoreId = s.Id
WHERE t.revenue = (
  SELECT MAX(revenue)
  FROM (
    SELECT o.StoreId, SUM(oi.Qty * i.UnitPrice) AS revenue
    FROM orders o
    JOIN orderitems oi ON oi.OrderId = o.Id
    JOIN items i ON i.Id = oi.ItemId
    GROUP BY o.StoreId
  )
);
