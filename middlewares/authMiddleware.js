const User = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../utils/SecretToken");

// must use before every route that needs to be protected from unauthorized access
module.exports.userVerification = (req, res, next) => {
  // const accessToken = req.cookies.accessToken;
  // Now access token comes from copy pasting it from login response to the bearer token thing in hoppscotch.
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ msg: "no token" });
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: "false" });
    } else {
      const user = await User.findById(data.id);
      if (!user)
        return res.status(404).json({ status: false, user: "user not found" });
      req.user = user;
      next();
    }
  });
};

module.exports.refresh = (req, res, next) => {
  const refreshToken = req.cookie.refreshToken;
  if (!refreshToken) {
    return res.json({ status: "false" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: "false" });
    } else {
      const user = await User.findById(data.id);
      if (refreshToken === user.refreshToken) {
        const accessToken = createAccessToken(user._id);

        res.cookie("accessToken", accessToken, { httpOnly: false });
        return res.json({ success: true, accessToken });
      }
    }
  });
};
