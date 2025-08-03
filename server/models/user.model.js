const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// This is the blueprint for a user
const userSchema = new Schema({
    // The username for the user
    username: {
        type: String,
        required: true,
        unique: true, // No two users can have the same username
        trim: true,     // Removes whitespace from the beginning and end
        minlength: 3    // Must be at least 3 characters long
    },
    // The email for the user
    email: {
        type: String,
        required: true,
        unique: true, // No two users can have the same email
        trim: true
    },
    // The password for the user
    password: {
        type: String,
        required: true,
        minlength: 6 // Must be at least 6 characters long
    },
}, {
    // This automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
});

// Create the 'User' model from the schema
const User = mongoose.model('User', userSchema);

// Make the User model available for other files to use
module.exports = User;