-- 재직연수 TOP 3
SELECT professor_id, name, tenure_years
FROM professors
ORDER BY tenure_years DESC
LIMIT 3;
