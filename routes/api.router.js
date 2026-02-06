const apiRouter = require("express").Router();
const topicsRouter = require("./topic.router");
apiRouter.use("/topics", topicsRouter);

const articlesRouter = require("./articles.router");
apiRouter.use("/articles", articlesRouter);

const usersRouter = require("./users.router");
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
