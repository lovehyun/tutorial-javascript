-- 없으면 INSERT
INSERT INTO departments (dept_id, dept_name)
SELECT 'D99','TempDept'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE dept_id='D99');
SELECT * FROM departments WHERE dept_id='D99';
DELETE FROM departments WHERE dept_id='D99';
