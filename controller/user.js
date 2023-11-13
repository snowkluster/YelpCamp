import { User } from "../models/user.js";

export const registerUser = async (req, res, next) => {
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
}

export const loginUser = (req, res) => {
    const redirectTo = res.locals.returnTo || '/campground'
    req.flash('success', 'welcome back!');
    delete req.session.returnTo
    res.redirect(redirectTo);
}