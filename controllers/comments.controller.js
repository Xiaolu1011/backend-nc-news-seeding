const { removeCommentById } = require("../models/comments.model");

exports.deleteCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
