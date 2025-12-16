BEGIN;
UPDATE students SET year=99 WHERE student_id='ST001';
ROLLBACK;
SELECT * FROM students WHERE student_id='ST001';
