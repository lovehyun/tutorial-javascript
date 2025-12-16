-- 목적: 인덱스 생성(선택)
-- 자주 조회/조인하는 컬럼에 인덱스를 고려합니다.

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(UserId);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(StoreId);
CREATE INDEX IF NOT EXISTS idx_orderitems_order ON orderitems(OrderId);
CREATE INDEX IF NOT EXISTS idx_orderitems_item ON orderitems(ItemId);
