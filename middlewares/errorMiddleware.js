module.exports = (err, req, res, next) => {
  let { status, message = "Error occured" } = err;
  res.status(status).json(message);
};
