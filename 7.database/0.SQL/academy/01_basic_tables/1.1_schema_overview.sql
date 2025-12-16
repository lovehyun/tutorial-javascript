-- 목적: Academy DB 관계를 읽고 이해
-- 실제 생성/샘플데이터는 루트 academy_init.sql

-- departments (1) - (N) students/professors/courses
-- professors  (1) - (N) courses
-- students    (1) - (N) enrollments
-- courses     (1) - (N) enrollments
-- enrollments (1) - (0~1) grades (성적이 없을 수도 있음)
