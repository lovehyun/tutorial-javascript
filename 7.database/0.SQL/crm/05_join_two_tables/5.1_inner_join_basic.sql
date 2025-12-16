-- 목적: 주문에 고객 이름 붙이기(INNER JOIN)

SELECT
  o.Id AS order_id,
  o.OrderAt,
  u.Id AS user_id,
  u.Name AS user_name
FROM orders o
JOIN users u ON u.Id = o.UserId
ORDER BY o.OrderAt;
