require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "10m",
  });
};

module.exports.createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });
};
