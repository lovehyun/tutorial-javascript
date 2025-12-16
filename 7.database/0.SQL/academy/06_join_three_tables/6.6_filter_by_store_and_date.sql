-- 특정 학기(semester) 과목만
SELECT course_id, title, semester
FROM courses
WHERE semester='2025-Fall'
ORDER BY course_id;
