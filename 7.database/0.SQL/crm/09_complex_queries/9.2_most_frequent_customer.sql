-- 목적(실무 질문):
-- "가장 많은 횟수로 방문하는 단골 고객은 누구인가?" (방문=주문 수)

WITH user_visits AS (
  SELECT
    u.Id AS user_id,
    u.Name AS user_name,
    COUNT(o.Id) AS visit_cnt,
    MAX(o.OrderAt) AS last_visit_at
  FROM users u
  JOIN orders o ON o.UserId = u.Id
  GROUP BY u.Id, u.Name
)
SELECT *
FROM user_visits
ORDER BY visit_cnt DESC, last_visit_at DESC
LIMIT 1;
