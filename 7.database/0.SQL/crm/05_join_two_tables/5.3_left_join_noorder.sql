-- 목적: 주문이 없는 고객 찾기(LEFT JOIN + NULL)

SELECT u.Id, u.Name
FROM users u
LEFT JOIN orders o ON o.UserId = u.Id
WHERE o.Id IS NULL
ORDER BY u.Id;
