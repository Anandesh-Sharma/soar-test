const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token : {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User model
const User1 = mongoose.model('User1', UserSchema);

module.exports = {
    User1
};