-- 목적: "이미 있으면 UPDATE, 없으면 INSERT" 같은 패턴 맛보기
-- SQLite는 INSERT OR IGNORE / INSERT OR REPLACE 등을 제공하지만,
-- 학습자는 먼저 "존재 확인" 감각부터 가져가는 게 좋습니다.

-- 1) 존재 확인
SELECT COUNT(*) AS cnt FROM items WHERE Id='I998';

-- 2) 없으면 INSERT (직접 수행)
INSERT INTO items (Id, Name, Type, UnitPrice)
SELECT 'I998','샘플상품','Test',11111
WHERE NOT EXISTS (SELECT 1 FROM items WHERE Id='I998');

SELECT * FROM items WHERE Id='I998';

-- 정리: 원복
DELETE FROM items WHERE Id='I998';
