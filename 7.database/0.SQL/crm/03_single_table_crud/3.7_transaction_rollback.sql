-- 목적: 트랜잭션 ROLLBACK(되돌리기)
BEGIN;

UPDATE users SET Age=999 WHERE Id='U006';
-- 실수했다고 가정!
ROLLBACK;

SELECT Id, Name, Age FROM users WHERE Id='U006';
