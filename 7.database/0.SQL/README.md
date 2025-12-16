# SQLite3 SQL 실습 패키지 (촘촘 버전 · 2개 DB 시나리오)

이 패키지는 **SQL 완전 초보자**가 SQLite3로 다음을 단계별로 학습하도록 설계되었습니다.

- 테이블 만들기 / 데이터 넣기
- 단일 테이블 CRUD
- 검색/정렬/페이지네이션
- 집계(GROUP BY/HAVING)
- JOIN (2개 → 3~4개)
- 서브쿼리(스칼라/IN/EXISTS/상관/파생테이블)
- 실무형 리포트 쿼리(Top-N, 비중, 단골/매출, 리텐션 감각)

## 두 개의 큰 컨셉 DB
1) **CRM DB**: 고객·매장·상품·주문·주문상품(수량 포함) → “매출 1위 고객/단골/인기상품” 같은 실무 질문에 적합  
2) **Academy DB**: 학과·학생·교수·과목·수강·성적 → “GPA/수강인원/교수 부하/위험학생” 같은 교육 시나리오에 적합

---

## 빠른 시작

### 1) CRM 초기화
```bash
sqlite3 crm.db < crm_init.sql
sqlite3 crm.db
```
```sql
.headers on
.mode column
.nullvalue NULL
.read crm/Part_05_join_two_tables/5.3_left_join_주문없는고객찾기.sql
```

### 2) Academy 초기화
```bash
sqlite3 academy.db < academy_init.sql
sqlite3 academy.db
```
```sql
.headers on
.mode column
.nullvalue NULL
.read academy/Part_08_subquery_advanced/8.2_derived_table_GPA계산.sql
```

---

## 추천 학습 루트(초보자)
- (1회차) CRM Part_01~Part_04: 단일 테이블 + 집계까지
- (2회차) CRM Part_05~Part_06: JOIN 감각 잡기
- (3회차) CRM Part_07~Part_09: 서브쿼리/복합 리포트
- (복습/확장) Academy를 같은 순서로 반복(개념이 훨씬 탄탄해집니다)

> 각 Part 폴더의 README에 “학습 질문(실무 상황)”과 “해설 포인트”가 들어 있습니다.
