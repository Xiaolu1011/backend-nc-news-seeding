const seed = require("./db/seeds/seed");
const devData = require("./db/data/development-data");

const app = require("./app");
const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const devData = require("./db/data/development-data");

const PORT = process.env.PORT || 9090;

if (process.env.NODE_ENV === "production") {
  seed(devData)
    .then(() => {
      console.log("Production database seeded");
      app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    })
    .catch((err) => {
      console.error("Seeding error:", err);
    });
} else {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

// const app = require("./app");
// const port = 9090;

// app.listen(port, () => {
//   console.log(`Listening on ${port}...`);
// });
