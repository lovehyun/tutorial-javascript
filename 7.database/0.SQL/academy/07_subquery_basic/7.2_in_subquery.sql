-- A 받은 학생(IN)
SELECT student_id, name
FROM students
WHERE student_id IN (
  SELECT e.student_id
  FROM enrollments e
  JOIN grades g ON g.enroll_id=e.enroll_id
  WHERE g.letter='A'
)
ORDER BY student_id;
