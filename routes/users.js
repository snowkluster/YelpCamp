import express from "express";
import passport from "passport";
import { User } from "../models/user.js";
import { wrapAsync } from "../util/catchAsync.js";
import { storeReturnTo } from "../middleware/middle.js";

const users = express.Router();

users.route("/register")
    .get((req, res) => {
        res.render("users/register");
    })
    .post(wrapAsync(async (req, res, next) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            console.log(registeredUser)
            req.login(registeredUser,err => {
                if(err) return next(err);
            })
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/campground");
        } catch (error) {
            req.flash('errors', error.message)
            res.redirect('register');
        }
    }));

users.route('/login')
    .get((req, res) => {
        res.render("users/login")
    })
    .post(storeReturnTo, passport.authenticate('local', { faillureFlash: true, failureRedirect: '/login' }), (req, res) => {
        const redirectTo = res.locals.returnTo || '/campground'
        req.flash('success', 'welcome back!');
        delete req.session.returnTo
        res.redirect(redirectTo);
    })

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
