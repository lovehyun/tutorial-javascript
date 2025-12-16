-- 목적: 상관 서브쿼리로 고객별 최근 주문 1건

SELECT o.*
FROM orders o
WHERE o.OrderAt = (
  SELECT MAX(o2.OrderAt)
  FROM orders o2
  WHERE o2.UserId = o.UserId
)
ORDER BY o.UserId;
