-- 목적: CRM DB의 테이블 관계를 눈으로 익히기
-- 실행보다는 "읽기"용입니다. 실제 생성/데이터는 루트 crm_init.sql

-- 테이블
-- users       : 고객
-- stores      : 매장
-- items       : 상품
-- orders      : 주문(고객/매장에 종속)
-- orderitems  : 주문상품(주문 1건에 여러 상품 + Qty)

-- 관계(1:N)
-- users  (1) --- (N) orders
-- stores (1) --- (N) orders
-- orders (1) --- (N) orderitems
-- items  (1) --- (N) orderitems

-- sqlite3에서 아래를 실행해 보세요:
-- .tables
-- .schema users
-- .schema orders
-- .schema orderitems
