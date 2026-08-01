const User = require("../models/user");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res) => {
  const { username, email, password } = req.body.User;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ message: "user already exists" });
  }
  const user = await User.create({ email, password, username });
  const accessToken = createAccessToken(user._id);
  res.cookie("accessToken", accessToken, {
    withCredentials: true,
    httpOnly: false,
  });

  const refreshToken = createRefreshToken(user._id);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.refreshToken = refreshToken;
  await user.save();

  console.log(user.password);

  res.status(201).json({
    message: "User signed in successfully",
    success: true,
    accessToken: accessToken,
    refreshToken: "generated",
  });
};

module.exports.Login = async (req, res) => {
  const { email, password } = req.body.User;
  if (!email || !password) {
    return res.json({ message: "all fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "incorrect password or email" });
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return res.json({ message: "incorrect password or email" });
  }
  const accessToken = createAccessToken(user._id);
  res.cookie("accessToken", accessToken, {
    withCredentials: true,
    httpOnly: false,
  });

  const refreshToken = createRefreshToken(user._id);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    message: "user logged in successfully",
    accessToken: accessToken,
    refreshToken: "generated",
  });
};

module.exports.Logout = async (req, res) => {
  const refreshToken = req.cookie.refreshToken;
  //if no refreshtoken user is already logged out
  if (!refreshToken) {
    return res.status(200).json({ succes: true, msg: "user logged out" });
  }

  const user = User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = "";
    user.save();
  }

  res.clearCookie("accessToken", {
    httpOnly: false,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({ success: true, msg: "user loggedout successfully" });
};

// module.exports.profile = async (req, res) => {
//   res.json({ data: "data", user: req.user.username });
// };

module.exports.refresh = async (req, res) => {
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
