import express from "express";
import passport from "passport";

import { wrapAsync } from "../util/catchAsync.js";
import { storeReturnTo } from "../middleware/middle.js";
import { loginUser, registerUser } from "../controller/user.js";

const users = express.Router();

users.route("/register")
    .get((req, res) => {
        res.render("users/register");
    })
    .post(wrapAsync(registerUser));

users.route('/login')
    .get((req, res) => {
        res.render("users/login")
    })
    .post(storeReturnTo, passport.authenticate('local', { faillureFlash: true, failureRedirect: '/login' }), loginUser)

users.route('/logout')
    .get((req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Logged Out');
            res.redirect('/campground');
        })
    })

export { users };
