-- 목적: 기본 집계 함수

SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS order_count FROM orders;

SELECT AVG(UnitPrice) AS avg_price FROM items;
SELECT MIN(UnitPrice) AS min_price, MAX(UnitPrice) AS max_price FROM items;
