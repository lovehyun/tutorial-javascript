-- 목적: 필요한 컬럼만 선택해서 조회
SELECT Id, Name, Age, Address
FROM users
ORDER BY Id;

SELECT Id, Name, Type, UnitPrice
FROM items
ORDER BY UnitPrice DESC;
