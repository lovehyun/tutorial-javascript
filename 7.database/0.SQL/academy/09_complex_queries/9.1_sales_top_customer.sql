-- 학점(GPA 유사) 계산: A=4, B=3, C=2, D=1, F=0
WITH letter_points AS (
  SELECT 'A' AS letter, 4 AS pt UNION ALL
  SELECT 'B', 3 UNION ALL
  SELECT 'C', 2 UNION ALL
  SELECT 'D', 1 UNION ALL
  SELECT 'F', 0
),
scored AS (
  SELECT e.student_id, c.credits, lp.pt
  FROM enrollments e
  JOIN grades g ON g.enroll_id=e.enroll_id
  JOIN courses c ON c.course_id=e.course_id
  JOIN letter_points lp ON lp.letter=g.letter
)
SELECT student_id,
       ROUND(SUM(credits*pt)*1.0/SUM(credits),2) AS gpa_like
FROM scored
GROUP BY student_id
ORDER BY gpa_like DESC;
