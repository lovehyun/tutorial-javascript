-- 목적: Top-N 집계(상품 타입별 평균 가격)

SELECT Type, ROUND(AVG(UnitPrice), 0) AS avg_price
FROM items
GROUP BY Type
ORDER BY avg_price DESC
LIMIT 5;
