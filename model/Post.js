const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    id: {type: String},
    user_uid: {type: String},
    title: {type: String},
    content: {type: String},
    images: {type: String},
    tag: {type: String},
    comment: {type: [String]},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Post', Post);
