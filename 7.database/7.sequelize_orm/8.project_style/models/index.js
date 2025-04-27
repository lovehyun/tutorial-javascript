const sequelize = require('../config/database');
const User = require('./user');
const Post = require('./post');

// 관계 설정
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

const db = { sequelize, User, Post };

module.exports = db;
