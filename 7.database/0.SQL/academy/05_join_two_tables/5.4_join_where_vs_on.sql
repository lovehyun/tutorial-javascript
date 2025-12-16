-- LEFT JOIN에서 조건 위치 차이 예시
-- A) WHERE에서 과목 조건 -> 미채점 학생이 사라질 수 있음(상황에 따라)
SELECT e.enroll_id, e.course_id, g.letter
FROM enrollments e
LEFT JOIN grades g ON g.enroll_id=e.enroll_id
WHERE e.course_id='CS201';

-- B) ON에 조건을 넣으면 형태가 달라질 수 있음(개념 확인용)
SELECT e.enroll_id, e.course_id, g.letter
FROM enrollments e
LEFT JOIN grades g
  ON g.enroll_id=e.enroll_id
WHERE e.course_id='CS201';
