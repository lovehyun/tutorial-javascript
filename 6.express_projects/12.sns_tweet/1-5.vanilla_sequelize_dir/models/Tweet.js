const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Tweet = sequelize.define('Tweet', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    likes_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'tweet',          // 테이블명을 소문자 'tweet'으로 고정
    timestamps: false,           // createdAt, updatedAt 자동 생성 끔
});

// User 1명이 여러 Tweet 작성
User.hasMany(Tweet, { foreignKey: 'user_id' });
Tweet.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Tweet;
