const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment can not be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    blog_id: {
        type: String,
        required: [true, "A Comment must have an ID"]
    },
    name: {
        type: String,
        required: [true, 'Comment must belong to a user']
    },
    userImageLink: {
        type: String,
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;