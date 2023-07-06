const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        userName: {type: String, required: true},
        comment: {type: String, required: true},
        time: {type: String, required: true}
    },
    {versionKey: false}
);

const CommentModel = mongoose.model('comment', commentSchema);

module.exports = {CommentModel};
