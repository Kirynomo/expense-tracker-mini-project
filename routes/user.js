const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { userVerification } = require("../middlewares/authMiddleware");

router.post("/signup", wrapAsync(userController.Signup));
router.post("/login", wrapAsync(userController.Login));
router.post("/logout", wrapAsync(userController.Logout));
// router.get("/profile", userVerification, wrapAsync(userController.profile));
router.post("/refresh", wrapAsync(userController.refresh));

module.exports = router;
