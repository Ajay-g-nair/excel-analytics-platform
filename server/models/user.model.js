const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // --- THIS IS THE NEW FIELD ---
    role: {
        type: String,
        enum: ['user', 'admin'], // The role can only be one of these two values
        default: 'user'         // By default, every new user is a regular 'user'
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;