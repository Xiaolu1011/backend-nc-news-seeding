const db = require("../connection");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  await db.query(`
  CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR NOT NULL,
    img_url VARCHAR(1000) NOT NULL
  );
`);
  await db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL
  );
`);
  await db.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
  );
`);
  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR NOT NULL REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

  await Promise.all(
    topicData.map((topic) => {
      return db.query(
        `
        INSERT INTO topics (slug, description, img_url)
        VALUES ($1, $2, $3);
        `,
        [topic.slug, topic.description, topic.img_url],
      );
    }),
  );

  await Promise.all(
    userData.map((user) => {
      return db.query(
        `
        INSERT INTO users (username, name, avatar_url)
        VALUES ($1, $2, $3);
        `,
        [user.username, user.name, user.avatar_url],
      );
    }),
  );

  await Promise.all(
    articleData.map((article) => {
      return db.query(
        `
        INSERT INTO articles
          (title, topic, author, body, created_at, votes, article_img_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
          article.votes,
          article.article_img_url,
        ],
      );
    }),
  );

  const { rows: articleRows } = await db.query(
    `SELECT article_id, title FROM articles;`,
  );
  const titleToId = {};
  articleRows.forEach((row) => {
    titleToId[row.title] = row.article_id;
  });

  await Promise.all(
    commentData.map((comment) => {
      const articleId = titleToId[comment.article_title];

      if (articleId === undefined) {
        throw new Error(
          `Could not find article_id for comment.article_title="${comment.article_title}"`,
        );
      }

      return db.query(
        `
        INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES ($1, $2, $3, $4, $5);
        `,
        [
          articleId,
          comment.body,
          comment.votes,
          comment.author,
          comment.created_at,
        ],
      );
    }),
  );
};

module.exports = seed;
