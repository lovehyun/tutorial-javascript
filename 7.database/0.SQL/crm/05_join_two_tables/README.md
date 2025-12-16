# CRM · 05_join_two_tables — JOIN 2개 테이블

## 이 파트에서 배우는 것
- INNER/LEFT JOIN
- ON vs WHERE 위치
- JOIN + 집계

## 실무 질문
- 주문 내역에 고객 이름을 붙이고 싶어요(INNER JOIN).
- 주문이 없는 고객도 포함해서 보고 싶어요(LEFT JOIN).
- 단골 고객(주문 횟수 상위)은 누구인가요?

## 실행 방법
1) DB 초기화 후 sqlite3 접속
2) 아래처럼 실행
```sql
.read crm/05_join_two_tables/(파일명).sql
```
