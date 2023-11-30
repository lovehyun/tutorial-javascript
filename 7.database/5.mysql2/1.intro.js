// npm install mysql2

// mysql2 모듈을 불러옵니다.
const mysql = require('mysql2');

// MySQL 연결 정보를 설정합니다.
const db = mysql.createConnection({
    host: 'localhost', // MySQL 호스트 주소
    user: '사용자명', // MySQL 사용자명
    password: '비밀번호', // MySQL 비밀번호
    database: '데이터베이스명', // 사용할 데이터베이스명
});

// MySQL과 연결합니다.
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류: ', err);
        throw err;
    }
    console.log('MySQL과 성공적으로 연결되었습니다.');
});

// 여기에 SQL 쿼리 및 데이터베이스 작업을 수행하는 코드를 추가합니다.

// 예제: SELECT 쿼리 수행
db.query('SELECT * FROM 테이블명', (err, results, fields) => {
    if (err) {
      console.error('SELECT 쿼리 오류: ', err);
      throw err;
    }

    // 결과 출력
    console.log('쿼리 결과: ', results);

    // 열 정보 출력
    console.log('열 정보: ', fields);
});
  

// 연결을 종료합니다.
db.end((err) => {
    if (err) {
        console.error('MySQL 연결 종료 오류: ', err);
        throw err;
    }
    console.log('MySQL 연결이 성공적으로 종료되었습니다.');
});
