const express = require("express");
const commentRouter = express.Router();
const { postComment, getCommentsByMovieId } = require("../controllers/commentController");


// POST /api/comments - Post a new comment (protected route)
commentRouter.post("/",  postComment);
commentRouter.get("/:movieId", getCommentsByMovieId)

module.exports = commentRouter;