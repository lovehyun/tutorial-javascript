# SQLite3 직접 접근에서 Sequelize ORM으로 변경하기

## 프로젝트 구조

```
your-project/
├── models.js      // Sequelize 초기화 및 모델 정의
├── app.js         // Express 서버 + API 핸들링
├── database.db    // SQLite 데이터베이스 파일
├── public/        // 정적 파일 (HTML/CSS/JS)
└── package.json
```

---

## SQLite3 직접 접근 vs Sequelize ORM

| 항목         | SQLite3 직접 접근         | Sequelize ORM                      |
|:-------------|:---------------------------|:-----------------------------------|
| DB 연결      | `new sqlite3.Database`      | `new Sequelize(...)`               |
| 쿼리 실행    | `db.run`, `db.get`, `db.all` | `Model.create()`, `Model.findOne()`, `Model.findAll()` |
| 관계 설정    | SQL JOIN 직접 작성          | `hasMany`, `belongsTo`, `belongsToMany` 선언 |
| 코드 구조    | SQL 위주 절차적 코드        | 모델 기반 선언적 코드              |
| 유지보수성   | 낮음                        | 높음                               |

---

## SQLite3를 Sequelize ORM으로 변경하는 절차

1. **Sequelize 설치**
   ```bash
   npm install sequelize sqlite3
   ```

2. **Sequelize 초기화**
   - `new Sequelize({ dialect: 'sqlite', storage: 'database.db' })` 로 데이터베이스 연결

3. **모델 정의**
   - `User`, `Tweet`, `Like` 등의 모델을 `sequelize.define`로 작성

4. **모델 관계 설정**
   - `User.hasMany(Tweet)`
   - `Tweet.belongsTo(User)`
   - `User.belongsToMany(Tweet, { through: Like })`

5. **기존 SQL 쿼리 삭제 및 ORM 메서드로 변경**
   - `INSERT`, `SELECT`, `UPDATE`, `DELETE` 쿼리들을
   - `Model.create()`, `Model.findOne()`, `Model.update()`, `Model.destroy()` 등으로 대체

6. **서버 코드와 모델 코드 분리**
   - `models.js` : Sequelize 연결 및 모델 관리
   - `app.js` : Express 서버와 API 핸들링 담당

7. **서버 시작 시 DB 동기화**
   ```javascript
   sequelize.sync().then(() => {
       app.listen(PORT, () => console.log(`서버 실행 중`));
   });
   ```

---

## Sequelize ORM 사용의 장단점

### 장점
- **가독성 향상**: SQL을 직접 작성하지 않고 메서드로 직관적으로 조작 가능
- **유지보수성 증가**: 테이블 구조 변경, 관계 추가 등이 코드 수정으로 간편히 가능
- **보안성 향상**: ORM이 SQL Injection 같은 위험을 줄여줌
- **이식성 향상**: 나중에 MySQL, PostgreSQL 등 다른 DB로 쉽게 전환 가능

### 단점
- **러닝커브 존재**: ORM 문법을 따로 학습해야 함
- **복잡한 쿼리는 오히려 불편**: 아주 복잡한 JOIN/집계 쿼리는 ORM보다 직접 SQL이 더 나은 경우도 있음
- **추가 추상화 오버헤드**: ORM이 내부적으로 SQL을 생성하므로 약간의 성능 손실 가능성

---

## 결론

SQLite3의 직접 접근 방식은 간단한 프로젝트에는 빠르지만, 규모가 커질수록 유지보수가 어려워집니다.
Sequelize ORM을 도입하면 코드 관리가 체계적이고 확장성이 좋아져, 장기적인 관점에서 훨씬 유리합니다.

**👉 따라서, 단순한 CRUD 이상의 기능이 필요하거나 장기적인 확장을 고려한다면 ORM 도입을 추천합니다.**

