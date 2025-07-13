const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movies",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const commentModel = mongoose.model("comments", commentSchema);
module.exports = commentModel;