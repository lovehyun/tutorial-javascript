-- 목적: GROUP BY 기본(매장별 주문 수)

SELECT StoreId, COUNT(*) AS order_cnt
FROM orders
GROUP BY StoreId
ORDER BY order_cnt DESC;
