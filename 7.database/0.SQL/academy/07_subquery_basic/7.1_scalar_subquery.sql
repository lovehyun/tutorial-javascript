-- 평균 점수보다 높은 성적만
SELECT grade_id, enroll_id, score, letter
FROM grades
WHERE score > (SELECT AVG(score) FROM grades)
ORDER BY score DESC;
