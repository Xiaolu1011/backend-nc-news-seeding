const db = require("../db/connection");

exports.selectUsers = async () => {
  const queryStr = `
    SELECT username, name, avatar_url
    FROM users;
  `;

  const { rows } = await db.query(queryStr);
  return rows;
};
