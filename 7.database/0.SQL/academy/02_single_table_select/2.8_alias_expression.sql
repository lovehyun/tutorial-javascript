-- 점수에 +5 보너스 표시(표현식)
SELECT grade_id, enroll_id, score, (score + 5) AS score_with_bonus
FROM grades
ORDER BY score DESC;
