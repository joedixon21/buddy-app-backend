exports.customErrorHandle = (err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ status: err.status, msg: err.msg });
  } else next(err);
};

exports.ServerErrorHandle = (err, request, response, next) => {
  response.status(500).send({ msg: "Server Error!" });
};
