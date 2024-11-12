// npm install sequelize sqlite3
const { Sequelize, DataTypes } = require('sequelize');

// SQLite 데이터베이스를 사용하여 Sequelize 인스턴스 생성
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // SQLite 데이터베이스 파일
});

// User 모델 정의
// -- User 테이블 생성
// CREATE TABLE IF NOT EXISTS User (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   email TEXT NOT NULL UNIQUE,
//   age INTEGER
// );
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

// 순차적으로 실행되는 비동기 함수
(async () => {
    // 1. 데이터베이스 동기화 및 초기화
    await sequelize.sync({ force: true }); // 기존 테이블을 모두 지우고 새로 생성
    console.log('데이터베이스가 초기화되었습니다.');

    // 2. 데이터 삽입 (Create)
    // INSERT INTO User (name, email, age) VALUES ('Alice', 'alice@example.com', 25);
    // INSERT INTO User (name, email, age) VALUES ('Bob', 'bob@example.com', 30);
    await User.create({ name: 'Alice', email: 'alice@example.com', age: 25 });
    await User.create({ name: 'Bob', email: 'bob@example.com', age: 30 });
    console.log("Alice와 Bob이 데이터베이스에 삽입되었습니다.");

    // 3. 데이터 조회 (Read)
    // SELECT * FROM User;
    const users = await User.findAll();
    console.log("모든 사용자:", JSON.stringify(users, null, 2));

    // 4. 데이터 업데이트 (Update)
    // UPDATE User SET age = 26 WHERE name = 'Alice';
    await User.update({ age: 26 }, { where: { name: 'Alice' } });
    console.log("Alice의 나이가 업데이트되었습니다.");

    // 5. 데이터 삭제 (Delete)
    // DELETE FROM User WHERE name = 'Bob';
    await User.destroy({ where: { name: 'Bob' } });
    console.log("Bob이 삭제되었습니다.");
})();
