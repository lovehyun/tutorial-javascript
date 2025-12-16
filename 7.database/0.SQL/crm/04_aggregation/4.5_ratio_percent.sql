-- 목적: 전체 대비 비중(%) 계산 감각(매장별 주문 비중)

WITH store_orders AS (
  SELECT StoreId, COUNT(*) AS order_cnt
  FROM orders
  GROUP BY StoreId
),
total AS (
  SELECT SUM(order_cnt) AS total_cnt FROM store_orders
)
SELECT
  StoreId,
  order_cnt,
  ROUND(order_cnt * 100.0 / (SELECT total_cnt FROM total), 2) AS ratio_percent
FROM store_orders
ORDER BY order_cnt DESC;
