-- 목적: IN 서브쿼리로 "재구매 고객 상세" 조회

SELECT Id, Name, Age, Address
FROM users
WHERE Id IN (
  SELECT UserId
  FROM orders
  GROUP BY UserId
  HAVING COUNT(*) >= 2
)
ORDER BY Id;
