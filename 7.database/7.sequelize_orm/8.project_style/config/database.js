const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false, // SQL 쿼리 출력 끄기 (원하면 true로)
});

module.exports = sequelize;
