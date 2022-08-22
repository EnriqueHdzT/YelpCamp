const express = require("express");
const asyncWrap = require("../utils/asyncWrap");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

router
    .route("/register")
    .get(users.renderRegister)
    .post(asyncWrap(users.register));

router
    .route("/login")
    .get(users.renderLogin)
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        users.login
    );

router.get("/logout", users.logout);

module.exports = router;
