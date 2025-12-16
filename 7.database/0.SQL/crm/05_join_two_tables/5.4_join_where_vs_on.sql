-- 목적: LEFT JOIN에서 WHERE 위치 차이 체감

-- A) WHERE에서 조건을 걸면, 주문 없는 유저가 사라질 수 있습니다.
SELECT u.Id, u.Name, o.Id AS order_id
FROM users u
LEFT JOIN orders o ON o.UserId = u.Id
WHERE o.StoreId = 'S001'
ORDER BY u.Id;

-- B) ON에 조건을 넣으면, 유저는 유지되고 주문만 필터됩니다.
SELECT u.Id, u.Name, o.Id AS order_id
FROM users u
LEFT JOIN orders o
  ON o.UserId = u.Id AND o.StoreId = 'S001'
ORDER BY u.Id;
