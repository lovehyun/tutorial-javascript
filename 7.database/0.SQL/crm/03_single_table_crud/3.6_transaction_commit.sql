-- 목적: 트랜잭션 COMMIT(정상 저장)
BEGIN;

UPDATE users SET Address='Seoul' WHERE Id='U006';

COMMIT;

SELECT Id, Name, Address FROM users WHERE Id='U006';
