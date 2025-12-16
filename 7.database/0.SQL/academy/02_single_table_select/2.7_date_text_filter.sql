-- 2025-09-01에 등록된 수강
SELECT *
FROM enrollments
WHERE enrolled_at >= '2025-09-01' AND enrolled_at < '2025-09-02'
ORDER BY enroll_id;
