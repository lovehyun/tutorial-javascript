const sequelize = require('../config/database');
const User = require('./User');
const Tweet = require('./Tweet');
const Like = require('./Like');

// 관계 연결 (이미 각 모델에서 설정한 경우 생략 가능)
const db = { sequelize, User, Tweet, Like };

module.exports = db;
