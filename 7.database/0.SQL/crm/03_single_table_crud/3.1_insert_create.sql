-- 목적: Create(INSERT)
-- Q: 새 상품 등록
INSERT INTO items (Id, Name, Type, UnitPrice)
VALUES ('I999', '테스트상품', 'Test', 12345);

SELECT * FROM items WHERE Id='I999';
