// models.js
// npm i sequelize
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db',
    logging: false,
});

// 모델 정의
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'user',          // 기존 테이블과 호환성 유지, 소문자로 고정
    timestamps: false,          // 기존 테이블과 호환성 유지, createdAt, updatedAt 생성 안함
});

const Tweet = sequelize.define('Tweet', {
    content: { type: DataTypes.TEXT, allowNull: false },
    likes_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'tweet',
    timestamps: false,
});

// Like 모델
const Like = sequelize.define('Like', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    tweet_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'like',
    timestamps: false,
});

// 관계 설정
User.hasMany(Tweet, { foreignKey: 'user_id' });
Tweet.belongsTo(User, { foreignKey: 'user_id' });

User.belongsToMany(Tweet, { through: Like, foreignKey: 'user_id', otherKey: 'tweet_id' });
Tweet.belongsToMany(User, { through: Like, foreignKey: 'tweet_id', otherKey: 'user_id' });

// 외부로 내보내기
module.exports = { sequelize, User, Tweet, Like };
