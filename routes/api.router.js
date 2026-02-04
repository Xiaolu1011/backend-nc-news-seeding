const apiRouter = require("express").Router();
const topicsRouter = require("./topic.router");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
