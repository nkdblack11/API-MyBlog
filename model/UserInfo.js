const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfo = new Schema({
    id: {type: String},
    user_uid: {type: String},
    avatar: {type: String, default: null},
    firstName: {type: String, default: null},
    lastName: {type: String, default: null},
    phone: {type: String, default: null},
    gender: {type: String, default: null},
    address: {type: String, default: null},
});

module.exports = mongoose.model('UserInfor', UserInfo);
