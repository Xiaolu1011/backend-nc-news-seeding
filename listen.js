const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const devData = require("./db/data/development-data");

const app = require("./app");
const port = 9090;

app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});
