-- 목적: HAVING으로 그룹 조건 필터링(재구매 고객)

SELECT UserId, COUNT(*) AS order_cnt
FROM orders
GROUP BY UserId
HAVING COUNT(*) >= 2
ORDER BY order_cnt DESC;
