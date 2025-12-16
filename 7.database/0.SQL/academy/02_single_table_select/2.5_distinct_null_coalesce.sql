-- 수강 상태 목록
SELECT DISTINCT status FROM enrollments;

-- NULL 표시(성적 없는 경우 대비)
SELECT e.enroll_id, COALESCE(g.letter,'NO_GRADE') AS letter
FROM enrollments e
LEFT JOIN grades g ON g.enroll_id=e.enroll_id
ORDER BY e.enroll_id;
