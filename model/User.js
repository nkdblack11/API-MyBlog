const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    user_uid: {type: String},
    username: {type: String},
    password: {type: String},
    role: {type: String, default: 'user'},
    isActive: {type: Boolean, default: true},
    login: {type: String, default: 'Account'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', User);
