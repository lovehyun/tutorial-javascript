-- 목적: 2단계 필터(중간 집계 결과를 다시 조건으로 사용)
-- Q: "총 구매액이 평균 이상"인 고객만 뽑고 싶다.

WITH user_spend AS (
  SELECT u.Id AS user_id, u.Name AS user_name,
         SUM(oi.Qty * i.UnitPrice) AS spend
  FROM users u
  JOIN orders o ON o.UserId = u.Id
  JOIN orderitems oi ON oi.OrderId = o.Id
  JOIN items i ON i.Id = oi.ItemId
  GROUP BY u.Id, u.Name
)
SELECT *
FROM user_spend
WHERE spend >= (SELECT AVG(spend) FROM user_spend)
ORDER BY spend DESC;
