const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("../controllers/articles.controller");

articlesRouter.get("/", getArticles);

// articlesRouter.get("/:article_id", getArticleById);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

// articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
