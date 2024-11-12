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

// Post 모델 정의
// -- Post 테이블 생성
// CREATE TABLE IF NOT EXISTS Post (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   title TEXT NOT NULL,
//   content TEXT,
//   userId INTEGER,
//   FOREIGN KEY (userId) REFERENCES User(id)
// );
const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

// 관계 설정: User는 여러 Post를 가질 수 있음 (1:N 관계)
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// 복잡한 비동기 함수 예제
(async () => {
    // 1. 데이터베이스 동기화
    // -- User와 Post 테이블 생성
    await sequelize.sync({ force: true });
    console.log('데이터베이스가 초기화되었습니다.');

    // 2. 트랜잭션 내에서 User와 Post 생성
    // -- 트랜잭션 시작
    const t = await sequelize.transaction();
    try {
        // -- User 생성
        // INSERT INTO User (name, email, age) VALUES ('Alice', 'alice@example.com', 25);
        const user = await User.create({ name: 'Alice', email: 'alice@example.com', age: 25 }, { transaction: t });
        
        // -- Post 생성
        // INSERT INTO Post (title, content, userId) VALUES ('Alice의 첫 게시글', 'Hello world!', user.id);
        await Post.create({ title: 'Alice의 첫 게시글', content: 'Hello world!', userId: user.id }, { transaction: t });
        
        // INSERT INTO Post (title, content, userId) VALUES ('Alice의 두 번째 게시글', 'Sequelize ORM이 정말 편리해요!', user.id);
        await Post.create({ title: 'Alice의 두 번째 게시글', content: 'Sequelize ORM이 정말 편리해요!', userId: user.id }, { transaction: t });

        // -- 트랜잭션 커밋
        await t.commit();
        console.log("트랜잭션이 성공적으로 커밋되었습니다.");
    } catch (error) {
        // -- 트랜잭션 롤백
        await t.rollback();
        console.log("트랜잭션이 롤백되었습니다.");
    }

    // 3. 고급 쿼리: 사용자의 게시글과 함께 조회
    // -- Alice의 User 정보와 관련된 Post 데이터 조회
    // SELECT * FROM User 
    // JOIN Post ON User.id = Post.userId 
    // WHERE User.name = 'Alice';
    const userWithPosts = await User.findOne({
        where: { name: 'Alice' },
        include: Post, // Post 모델을 포함하여 조회
    });
    console.log("Alice의 모든 게시글:", JSON.stringify(userWithPosts, null, 2));

    // 4. 유효성 검사 추가 예제
    // -- 유효성 검사 실패 예제
    // INSERT INTO User (name, email, age) VALUES ('B', 'bob@example.com', 16);
    try {
        await User.create({ name: 'B', email: 'bob@example.com', age: 16 });
    } catch (error) {
        console.log("유효성 검사 실패:", error.errors[0].message);
    }

    // 5. 가상 속성 예제: User 모델에 가상 속성 추가
    // -- 가상 속성 예제는 데이터베이스에 직접 쿼리되지 않으며, 객체에 추가된 메서드입니다.
    User.prototype.getDisplayName = function () {
        return `${this.name} (${this.age} years old)`;
    };
    const user = await User.findOne({ where: { name: 'Alice' } });
    console.log("Alice의 디스플레이 이름:", user.getDisplayName());

    // 6. 집계 쿼리: 사용자가 작성한 게시글 수와 가장 최근 게시글 조회
    // -- Alice의 게시글 수와 가장 최근 게시글 날짜를 집계
    // SELECT COUNT(id) AS totalPosts, MAX(createdAt) AS latestPostDate
    // FROM Post WHERE userId = user.id;
    const postCountAndLatest = await Post.findOne({
        where: { userId: user.id },
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'totalPosts'],
            [sequelize.fn('MAX', sequelize.col('createdAt')), 'latestPostDate']
        ],
    });
    console.log("Alice의 게시글 수 및 최신 게시글 날짜:", postCountAndLatest.toJSON());
})();
