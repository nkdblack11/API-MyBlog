const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Token = new Schema({
    uid: {type: String},
    user_uid: {type: String},
    isRevoke: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Token', Token);

