import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import methodOverride from "method-override"
import mongoose from "mongoose";
import morgan from "morgan";
import ejsmate from "ejs-mate"
import { router } from "./routes/campgrounds.js";
import { reviews } from "./routes/reviews.js";
import { ids } from "./routes/id.js";
import { users } from "./routes/users.js";
import { AppError } from "./util/error.js";
import { User } from "./models/user.js";
import session from "express-session";
import flash from "connect-flash"
import passport from "passport";
import passportLocal from "passport-local"
import dotenv from "dotenv"
import MongoStore from 'connect-mongo';

if(process.env.NODE_ENV !== "production"){
    dotenv.config()
}
const SECRET=process.env.SECRET;

const store = MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/yelpcamp",
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: SECRET
    }
})


const sessionConfig = {
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const port = 3000
const app = express();

main().catch(err => console.log(err));
main().then(() => {
    console.log("mongo connection established");
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
}

app.engine("ejs", ejsmate)
app.use(methodOverride('_method'))
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('errors');
    next()
})

app.use('/campground', router)
app.use('/campground/:id', ids)
app.use('/campground/:id/reviews', reviews)
app.use('/', users)

app.get("/", (req, res) => {
    res.render('home')
})

app.all("*", (req, res, next) => {
    next(new AppError('Page not found', 404))
})

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (status === 404) {
        res.status(status).render('404');
    } else {
        res.status(status).render('Error', { err });
    }
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
