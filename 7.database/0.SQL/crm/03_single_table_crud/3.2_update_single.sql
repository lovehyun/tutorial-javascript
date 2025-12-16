-- 목적: Update(단일 컬럼)
-- Q: 테스트상품 가격을 +1000
UPDATE items
SET UnitPrice = UnitPrice + 1000
WHERE Id='I999';

SELECT * FROM items WHERE Id='I999';
