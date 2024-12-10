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
    apiKeys: [
        {
            key: { type: String, required: true },
            title: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model('User', userSchema);
