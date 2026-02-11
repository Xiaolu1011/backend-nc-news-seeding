const db = require("../db/connection");

// exports.selectArticles = async () => {
//   const queryStr = `
//     SELECT
//       articles.author,
//       articles.title,
//       articles.article_id,
//       articles.topic,
//       articles.created_at,
//       articles.votes,
//       articles.article_img_url,
//       COUNT(comments.comment_id)::INT AS comment_count
//     FROM articles
//     LEFT JOIN comments
//       ON comments.article_id = articles.article_id
//     GROUP BY articles.article_id
//     ORDER BY articles.created_at DESC;
//   `;
//   const { rows } = await db.query(queryStr);
//   return rows;
// };
exports.selectArticles = async (sort_by = "created_at", order = "desc") => {
  const validSortBys = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  if (!validSortBys.includes(sort_by)) {
    throw { status: 400, msg: "Bad request" };
  }

  const normalizedOrder = order.toLowerCase();
  if (normalizedOrder !== "asc" && normalizedOrder !== "desc") {
    throw { status: 400, msg: "Bad request" };
  }

  const queryStr = `
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
      ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${normalizedOrder};
  `;
  const { rows } = await db.query(queryStr);
  return rows;
};

exports.selectArticleById = async (article_id) => {
  const queryStr = `
    SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
    FROM articles
    WHERE article_id = $1;
  `;

  const { rows } = await db.query(queryStr, [article_id]);
  if (rows.length === 0) {
    throw { status: 404, msg: "Not found" };
  }
  return rows[0];
};

const checkArticleExists = async (article_id) => {
  const { rows } = await db.query(
    `SELECT article_id FROM articles WHERE article_id = $1;`,
    [article_id],
  );
  if (rows.length === 0) {
    throw { status: 404, msg: "Not found" };
  }
};

exports.selectCommentsByArticleId = async (article_id) => {
  const queryStr = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `;

  const { rows } = await db.query(queryStr, [article_id]);
  if (rows.length === 0) {
    await checkArticleExists(article_id);
  }

  return rows;
};

exports.insertCommentByArticleId = async (article_id, username, body) => {
  if (!username || !body) {
    throw { status: 400, msg: "Bad request" };
  }
  const queryStr = `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING comment_id, votes, created_at, author, body, article_id;
  `;
  const { rows } = await db.query(queryStr, [username, body, article_id]);
  return rows[0];
};

exports.updateArticleVotes = async (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    throw { status: 400, msg: "Bad request" };
  }
  if (typeof inc_votes !== "number") {
    throw { status: 400, msg: "Bad request" };
  }

  const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING author, title, article_id, body, topic, created_at, votes, article_img_url;
  `;

  const { rows } = await db.query(queryStr, [inc_votes, article_id]);

  if (rows.length === 0) {
    throw { status: 404, msg: "Not found" };
  }

  return rows[0];
};
