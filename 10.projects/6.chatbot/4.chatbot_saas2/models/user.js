const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    apiKeys: {
        type: [String], // API 키를 배열로 저장
        default: [],
    },
});

module.exports = mongoose.model('User', userSchema);
