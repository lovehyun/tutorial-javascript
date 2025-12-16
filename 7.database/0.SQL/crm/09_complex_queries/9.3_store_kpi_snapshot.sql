-- 목적(실무 질문):
-- "매장별 KPI 스냅샷(주문수/매출/객단가)을 한 번에 보고 싶다."

WITH order_totals AS (
  SELECT
    o.Id AS order_id,
    o.StoreId,
    SUM(oi.Qty * i.UnitPrice) AS order_total
  FROM orders o
  JOIN orderitems oi ON oi.OrderId = o.Id
  JOIN items i ON i.Id = oi.ItemId
  GROUP BY o.Id, o.StoreId
),
store_kpi AS (
  SELECT
    StoreId,
    COUNT(*) AS order_cnt,
    SUM(order_total) AS revenue,
    ROUND(AVG(order_total), 0) AS avg_basket
  FROM order_totals
  GROUP BY StoreId
)
SELECT
  s.Id AS store_id,
  s.Name AS store_name,
  k.order_cnt,
  k.revenue,
  k.avg_basket
FROM stores s
LEFT JOIN store_kpi k ON k.StoreId = s.Id
ORDER BY k.revenue DESC;
