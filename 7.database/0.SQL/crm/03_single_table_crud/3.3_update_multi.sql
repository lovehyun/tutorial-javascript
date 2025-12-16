-- 목적: Update(여러 컬럼)
-- Q: 테스트상품 이름/타입까지 바꾸기
UPDATE items
SET Name='테스트상품(수정)', Type='Test2'
WHERE Id='I999';

SELECT * FROM items WHERE Id='I999';
