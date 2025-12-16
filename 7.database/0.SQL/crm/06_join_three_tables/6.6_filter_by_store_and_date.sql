-- 목적: 특정 매장 + 기간 필터 후 매출/판매량 보기

-- Q: S001(강남분식)에서 12/01~12/07 사이에 팔린 상품별 판매량
SELECT
  i.Name AS item_name,
  SUM(oi.Qty) AS sold_qty,
  SUM(oi.Qty * i.UnitPrice) AS revenue
FROM orders o
JOIN orderitems oi ON oi.OrderId = o.Id
JOIN items i ON i.Id = oi.ItemId
WHERE o.StoreId = 'S001'
  AND o.OrderAt >= '2025-12-01' AND o.OrderAt < '2025-12-08'
GROUP BY i.Name
ORDER BY revenue DESC;
