-- 목적: 고객 목록을 기준으로 주문 수까지 보고 싶다(LEFT JOIN + GROUP)

SELECT
  u.Id, u.Name,
  COUNT(o.Id) AS order_cnt
FROM users u
LEFT JOIN orders o ON o.UserId = u.Id
GROUP BY u.Id, u.Name
ORDER BY order_cnt DESC, u.Id;
