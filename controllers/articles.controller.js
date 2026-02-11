const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleVotes,
} = require("../models/articles.model");

// exports.getArticles = async (req, res, next) => {
//   try {
//     const articles = await selectArticles();
//     res.status(200).send({ articles });
//   } catch (err) {
//     next(err);
//   }
// };
exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order } = req.query;
    const articles = await selectArticles(sort_by, order);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await selectCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { username, body } = req.body;

    const comment = await insertCommentByArticleId(article_id, username, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    const article = await updateArticleVotes(article_id, inc_votes);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
