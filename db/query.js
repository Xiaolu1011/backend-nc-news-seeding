const db = require("./connection");

const runQueries = async () => {
  try {
    const users = await db.query("SELECT * FROM users;");
    console.log("\nALL USERS:");
    console.log(users.rows);

    const codingArticles = await db.query(
      "SELECT * FROM articles WHERE topic = $1;",
      ["coding"],
    );
    console.log("\nARTICLES WITH TOPIC 'coding':");
    console.log(codingArticles.rows);

    const negativeComments = await db.query(
      "SELECT * FROM comments WHERE votes < 0;",
    );
    console.log("\nCOMMENTS WITH NEGATIVE VOTES:");
    console.log(negativeComments.rows);

    const topics = await db.query("SELECT * FROM topics;");
    console.log("\nALL TOPICS:");
    console.log(topics.rows);

    const grumpyArticles = await db.query(
      "SELECT * FROM articles WHERE author = $1;",
      ["grumpy19"],
    );
    console.log("\nARTICLES BY grumpy19:");
    console.log(grumpyArticles.rows);

    const popularComments = await db.query(
      "SELECT * FROM comments WHERE votes > 10;",
    );
    console.log("\nCOMMENTS WITH MORE THAN 10 VOTES:");
    console.log(popularComments.rows);

    const result = await db.query(`
  SELECT a.title, COUNT(*)::int AS reaction_count
  FROM emoji_article_user eau
  JOIN articles a ON eau.article_id = a.article_id
  GROUP BY a.title
  ORDER BY reaction_count DESC;
`);
    console.log(result.rows);
  } catch (err) {
    console.log("ERROR:", err);
  } finally {
    await db.end();
  }
};

runQueries();

// const db = require("../connection");

// exports.selectAllUsers = () => {
//   return db.query("SELECT * FROM users;").then((result) => result.rows);
// };

// exports.selectAllTopics = () => {
//   return db.query("SELECT * FROM topics;").then((result) => result.rows);
// };

// exports.selectArticlesByTopic = (topic) => {
//   return db
//     .query("SELECT * FROM articles WHERE topic = $1;", [topic])
//     .then((result) => result.rows);
// };

// exports.selectArticlesByAuthor = (author) => {
//   return db
//     .query("SELECT * FROM articles WHERE author = $1;", [author])
//     .then((result) => result.rows);
// };

// exports.selectCommentsWithNegativeVotes = () => {
//   return db.query("SELECT * FROM comments WHERE votes < 0;").then((result) => {
//     return result.rows;
//   });
// };

// exports.selectCommentsWithVotesOver = (minVotes) => {
//   return db
//     .query("SELECT * FROM comments WHERE votes > $1;", [minVotes])
//     .then((result) => result.rows);
// };
