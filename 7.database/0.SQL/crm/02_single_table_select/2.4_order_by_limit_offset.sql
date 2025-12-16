-- 목적: 정렬 + LIMIT/OFFSET(페이지네이션)

-- Q: 가장 비싼 상품 TOP 5
SELECT Id, Name, UnitPrice
FROM items
ORDER BY UnitPrice DESC
LIMIT 5;

-- Q: 최근 주문 5개
SELECT Id, OrderAt, StoreId, UserId
FROM orders
ORDER BY OrderAt DESC
LIMIT 5;

-- Q: 5개씩 2페이지(6~10번째)
SELECT Id, OrderAt, StoreId, UserId
FROM orders
ORDER BY OrderAt DESC
LIMIT 5 OFFSET 5;
