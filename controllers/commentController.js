const Comment = require("../models/comment");

// Post a new comment
const postComment = async (req, res) => {
  const { movieId, comment } = req.body;
  // const userId = req.user.id; // Extracted from JWT middleware

  try {
    // Validate input
    if (!movieId || !comment) {
      return res.status(400).json({ message: "Movie ID and comment are required" });
    }

    // Create and save the comment
    const newComment = new Comment({
      movieId,
      comment,
    });

    await newComment.save();

    res.status(201).json({ message: "Comment posted successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCommentsByMovieId = async (req, res) => {
  const { movieId } = req.params;
  try {
    // Validate input
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    // Find comments by movie ID
    const comments = await Comment.find({ movieId }).populate("movieId", "title");

    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this movie" });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


module.exports = { postComment, getCommentsByMovieId };