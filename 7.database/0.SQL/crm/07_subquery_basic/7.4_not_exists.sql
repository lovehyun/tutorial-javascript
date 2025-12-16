-- 목적: NOT EXISTS로 "주문 없는 고객만"

SELECT u.Id, u.Name
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.UserId = u.Id)
ORDER BY u.Id;
