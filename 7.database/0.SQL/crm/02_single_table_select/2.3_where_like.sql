-- 목적: LIKE로 부분 검색

-- Q: 이름에 '카페'가 포함된 매장?
SELECT Id, Name, Type
FROM stores
WHERE Name LIKE '%카페%';

-- Q: 주소에 'Seoul'이 들어가는 고객?
SELECT Id, Name, Address
FROM users
WHERE Address LIKE '%Seoul%';
