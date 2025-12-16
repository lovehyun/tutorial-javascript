-- 목적: DROP TABLE vs DELETE FROM 차이 이해(주석 중심)

-- 1) DROP TABLE
-- - "테이블 자체"를 제거합니다(구조+데이터).
-- - 다시 쓰려면 CREATE TABLE부터 다시 해야 합니다.
-- 예) DROP TABLE users;

-- 2) DELETE FROM
-- - 테이블 구조는 남기고 "데이터(행)"만 지웁니다.
-- - WHERE 없이 실행하면 전체 행 삭제(주의!)
-- 예) DELETE FROM users;   -- 전체 삭제

-- SQLite는 학습 중 실수하기 쉬우니,
-- 실습 DB는 crm_init.sql로 언제든 재초기화할 수 있게 해두었습니다.
