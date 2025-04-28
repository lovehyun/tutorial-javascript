// seed.js
const { sequelize, User, Tweet } = require('./models');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // 테이블 모두 새로 생성 (초기화)
        console.log('✅ 데이터베이스 동기화 완료');

        // 초기 사용자 생성
        const users = await User.bulkCreate([
            { username: 'user1', email: 'user1@example.com', password: 'password1' },
            { username: 'user2', email: 'user2@example.com', password: 'password2' },
        ]);

        console.log('✅ 사용자 삽입 완료');

        // 초기 트윗 생성
        await Tweet.bulkCreate([
            { content: '안녕하세요, 첫 트윗입니다!', user_id: users[0].id },
            { content: '두 번째 트윗이에요!', user_id: users[1].id },
        ]);

        console.log('✅ 트윗 삽입 완료');
    } catch (error) {
        console.error('❌ 시드 데이터 삽입 실패:', error.message);
    } finally {
        await sequelize.close();
    }
}

seed();
