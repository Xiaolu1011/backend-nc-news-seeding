// const { Pool } = require("pg");

// const ENV = process.env.NODE_ENV || 'development'

// require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

// const db = new Pool();

// if (!process.env.PGDATABASE) {
//     throw new Error("No PGDATABASE configured")
// } else {
//     console.log(`Connected to ${process.env.PGDATABASE}`)
// }

// module.exports = db;

const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

if (ENV !== "production") {
  require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });
}

const pool = new Pool(
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {},
);

pool
  .query("SELECT NOW();")
  .then(() => {
    const dbName =
      ENV === "production"
        ? "production database (via DATABASE_URL)"
        : process.env.PGDATABASE;
    console.log(`Connected to ${dbName}`);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = pool;
