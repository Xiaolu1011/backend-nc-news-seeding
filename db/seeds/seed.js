const db = require("../connection");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS emoji_article_user;`);
  await db.query(`DROP TABLE IF EXISTS emojis;`);
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

  await db.query(`
  CREATE TABLE emojis (
    emoji_id SERIAL PRIMARY KEY,
    emoji VARCHAR NOT NULL
  );
`);

  await db.query(`
  CREATE TABLE emoji_article_user (
    emoji_article_user_id SERIAL PRIMARY KEY,
    emoji_id INT NOT NULL REFERENCES emojis(emoji_id),
    username VARCHAR NOT NULL REFERENCES users(username),
    article_id INT NOT NULL REFERENCES articles(article_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (emoji_id, username, article_id)
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

  const emojiData = ["🔥", "😂", "💡", "❤️", "👀"];
  const { rows: insertedEmojis } = await db.query(
    `
  INSERT INTO emojis (emoji)
  SELECT UNNEST($1::varchar[])
  RETURNING emoji_id, emoji;
  `,
    [emojiData],
  );

  const emojiToId = {};
  insertedEmojis.forEach((e) => {
    emojiToId[e.emoji] = e.emoji_id;
  });

  // We’ll refer to articles by title, then convert to article_id using titleToId
  const reactionData = [
    {
      emoji: "🔥",
      username: "grumpy19",
      article_title: "Living in the shadow of a great man",
    },
    {
      emoji: "😂",
      username: "butter_bridge",
      article_title: "Living in the shadow of a great man",
    },
    {
      emoji: "❤️",
      username: "icellusedkars",
      article_title: "Living in the shadow of a great man",
    },

    {
      emoji: "👀",
      username: "grumpy19",
      article_title: "Eight pug gifs that remind me of mitch",
    },
    {
      emoji: "😂",
      username: "rogersop",
      article_title: "Eight pug gifs that remind me of mitch",
    },

    { emoji: "💡", username: "rogersop", article_title: "Student SUES Mitch!" },
    {
      emoji: "🔥",
      username: "icellusedkars",
      article_title: "Student SUES Mitch!",
    },
  ];

  await Promise.all(
    reactionData.map((reaction) => {
      const emoji_id = emojiToId[reaction.emoji];
      const article_id = titleToId[reaction.article_title];

      if (!emoji_id) {
        throw new Error(`Emoji not found in emojis table: ${reaction.emoji}`);
      }
      if (!article_id) {
        throw new Error(
          `Article title not found in articles table: ${reaction.article_title}`,
        );
      }

      return db.query(
        `
      INSERT INTO emoji_article_user (emoji_id, username, article_id)
      VALUES ($1, $2, $3);
      `,
        [emoji_id, reaction.username, article_id],
      );
    }),
  );
};

module.exports = seed;
