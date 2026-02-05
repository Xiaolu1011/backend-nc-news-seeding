exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlErrorCodes = {
    "22P02": { status: 400, msg: "Bad request" },
    23503: { status: 404, msg: "Not found" },
    23502: { status: 400, msg: "Bad request" },
  };
  if (psqlErrorCodes[err.code]) {
    return res.status(psqlErrorCodes[err.code].status).send({
      msg: psqlErrorCodes[err.code].msg,
    });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
