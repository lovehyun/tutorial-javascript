-- 목적: JOIN + GROUP BY (단골 고객 = 주문 횟수 상위)

SELECT
  u.Id, u.Name,
  COUNT(o.Id) AS visit_cnt,
  MAX(o.OrderAt) AS last_visit_at
FROM users u
JOIN orders o ON o.UserId = u.Id
GROUP BY u.Id, u.Name
ORDER BY visit_cnt DESC, last_visit_at DESC;
