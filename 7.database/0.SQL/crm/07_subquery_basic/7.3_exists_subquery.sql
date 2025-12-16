-- 목적: EXISTS로 "주문 있는 고객만"

SELECT u.Id, u.Name
FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.UserId = u.Id)
ORDER BY u.Id;
