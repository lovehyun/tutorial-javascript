const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Tweet = require('./Tweet');

const Like = sequelize.define('Like', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    tweet_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'like',         // 테이블명을 'like'로 소문자로 고정
    timestamps: false,         // createdAt, updatedAt 없음
});

// 다대다 관계 설정
User.belongsToMany(Tweet, {
    through: Like,
    as: 'LikedTweets',
    foreignKey: 'user_id',
    otherKey: 'tweet_id',
});

Tweet.belongsToMany(User, {
    through: Like,
    as: 'LikedByUsers',
    foreignKey: 'tweet_id',
    otherKey: 'user_id',
});

// N:M 매칭을 통한 ORM 스타을 JOIN 을 하기 위해서는 as 를 통해 alias 추가
/*
// 1:N (작성한 트윗)
User.hasMany(Tweet, { foreignKey: 'user_id' });
Tweet.belongsTo(User, { foreignKey: 'user_id' });

// N:M (좋아요한 트윗)
User.belongsToMany(Tweet, {
    through: Like,
    as: 'LikedTweets',             // 좋아요한 트윗 별칭
    foreignKey: 'user_id',
    otherKey: 'tweet_id',
});

Tweet.belongsToMany(User, {
    through: Like,
    as: 'LikedByUsers',            // 좋아요한 사용자 별칭
    foreignKey: 'tweet_id',
    otherKey: 'user_id',
});
*/

module.exports = Like;
