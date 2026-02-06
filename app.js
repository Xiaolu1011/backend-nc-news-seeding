const db = require("./db/connection");
const express = require("express");
const apiRouter = require("./routes/api.router");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/errors");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*path", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
