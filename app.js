const db = require("./db/connection");
const express = require("express");
const apiRouter = require("./routes/api.router");
const cors = require("cors");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/errors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "API running" });
});

app.use("/api", apiRouter);

app.all("/*path", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
