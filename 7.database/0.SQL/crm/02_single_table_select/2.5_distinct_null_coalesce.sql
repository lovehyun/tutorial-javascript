-- 목적: DISTINCT / NULL / COALESCE

-- Q: 주문이 발생한 매장 ID 목록(중복 제거)
SELECT DISTINCT StoreId
FROM orders
ORDER BY StoreId;

-- Q: NULL 비교는 '='가 아니라 IS NULL
SELECT Id, Name, Birthdate
FROM users
WHERE Birthdate IS NULL;

-- Q: NULL을 기본값으로 표시하기
SELECT Id, Name, COALESCE(Birthdate, 'UNKNOWN') AS BirthdateSafe
FROM users;
