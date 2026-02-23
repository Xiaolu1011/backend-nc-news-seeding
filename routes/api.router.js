const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "Welcome to the API" });
});

const topicsRouter = require("./topic.router");
apiRouter.use("/topics", topicsRouter);

const articlesRouter = require("./articles.router");
apiRouter.use("/articles", articlesRouter);

const usersRouter = require("./users.router");
apiRouter.use("/users", usersRouter);

const commentsRouter = require("./comments.router");
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
