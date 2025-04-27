const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
}, {
    timestamps: false, // createdAt, updatedAt 끄기 (선택사항)
});

// 가상 메서드
User.prototype.getDisplayName = function () {
    return `${this.name} (${this.age} years old)`;
};

module.exports = User;
