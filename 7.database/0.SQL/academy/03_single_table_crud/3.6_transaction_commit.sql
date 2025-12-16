BEGIN;
UPDATE students SET year=year+1 WHERE student_id='ST001';
COMMIT;
SELECT * FROM students WHERE student_id='ST001';
