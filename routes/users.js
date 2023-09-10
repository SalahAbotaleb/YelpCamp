const express = require("express");
const router = express.Router();

const user = require("../controllers/user")
const passport = require("passport");
const { registerPath } = require("../utils/middleware");

router.route("/register")
    .get(user.renderRegisterForm)
    .post(user.registerUser);

router.route("/login")
    .get(user.renderUserLoginForm)
    .post(registerPath, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.redirectUserAfterLogin);

router.get("/logout", user.logoutUser);

module.exports = router;