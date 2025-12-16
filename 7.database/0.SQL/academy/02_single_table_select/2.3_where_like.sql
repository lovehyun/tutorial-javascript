-- Q: 'Prof.'로 시작하는 교수
SELECT professor_id, name
FROM professors
WHERE name LIKE 'Prof.%';
