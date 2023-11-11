import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import methodOverride from "method-override"
import mongoose from "mongoose";
import morgan from "morgan";
import ejsmate from "ejs-mate"
import { router } from "./routes/campgrounds.js";
import { AppError } from "./util/error.js";

const port = 3000
const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

app.use('/campground', router)

app.get("/", (req, res) => {
    res.render('home')
})

app.all("*", (req, res, next) => {
    next(new AppError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (status === 404) {
        res.status(status).render('404');
    }
    res.status(status).render('Error', { err });
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
