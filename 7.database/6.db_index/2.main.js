// main.js

// sqlite3 mydatabase.db
// -- 타이머 활성화
// .timer on
// -- 쿼리 실행
// SELECT * FROM employees WHERE name = '정다사';
// -- 타이머 비활성화
// .timer off

// CREATE INDEX idx_name ON employees(name);
// CREATE INDEX idx_salary ON employees(salary);
// DROP INDEX idx_name;
// DROP INDEX idx_salary;

// SELECT *
// FROM employees
// WHERE department = 'HR'
//   AND salary > (SELECT AVG(salary) FROM employees WHERE department = 'HR');


const { connectToDatabase, queryName, queryAll } = require('./queryTime');

const db = connectToDatabase();

const searchName = '정다사'; // 찾고자 하는 이름을 입력하세요
const searchOptions = { // 검색 조건 설정
    name: '정다사',
    department: 'HR',
    salary: 60000
};

// 특정 사용자 쿼리 실행
queryName(db, searchName);

// 모든 사용자 쿼리 실행
queryAll(db, searchOptions);

// 모든 작업 후 데이터베이스 닫기
db.close();
