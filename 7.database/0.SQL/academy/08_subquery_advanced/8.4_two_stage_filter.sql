-- 평균점수 80 이상 학생만, 그 학생들의 수강 과목까지 보기(2단계)
WITH student_avg AS (
  SELECT e.student_id, AVG(g.score) AS avg_score
  FROM enrollments e JOIN grades g ON g.enroll_id=e.enroll_id
  GROUP BY e.student_id
),
good_students AS (
  SELECT student_id FROM student_avg WHERE avg_score >= 80
)
SELECT s.student_id, s.name, c.title
FROM students s
JOIN enrollments e ON e.student_id=s.student_id
JOIN courses c ON c.course_id=e.course_id
WHERE s.student_id IN (SELECT student_id FROM good_students)
ORDER BY s.student_id, c.course_id;
