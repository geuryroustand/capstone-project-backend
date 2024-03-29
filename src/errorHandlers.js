//404
export const notFoundErrHandler = (err, req, res, next) => {
  console.log(err);
  if (err.status === 404) {
    res.status(404).send({ error: err.message || "ERROR 404: Not Found!" });
  } else {
    next(err);
  }
};

//400
export const badReqErrHandler = (err, req, res, next) => {
  console.log("BAD REQUEST");
  if (err.status === 400) {
    res.status(400).send({ error: err.errors || "ERROR 400: Bad Request" });
  } else {
    next(err);
  }
};

// 403
export const forbiddenErrHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({ error: err.message || "ERROR 403: Forbidden " });
  } else {
    next(err);
  }
};

// 500
export const serverErrHandler = (err, req, res, next) => {
  res.status(500).send({ error: "ERROR 500: Generic Server Error" });
};
