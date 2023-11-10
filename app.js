import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import methodOverride from "method-override"
import mongoose from "mongoose";
import morgan from "morgan";
import ejsmate from "ejs-mate"
import { Campground } from "./models/campground.js";
import { AppError } from "./error.js";

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

function wrapAsync(fn){
    return function(req, res, next) {
        fn(req, res, next).catch(e =>next(e))
    }
}

app.get("/", (req, res) => {
    res.render('home')
})

app.post("/campground", async (req, res,next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(302, `/campground/${newCamp._id}`)
})

app.get("/campground", wrapAsync(async (req, res, next) => {
    const campground = await Campground.find({})
    if (!campground) {
        throw new AppError('CANNOT FIND PAGE', 404)
    } else {
        res.render('campgrounds/index', { campground })
    }
}));

app.get('/campground/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get("/campground/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    try {
        const campground = await Campground.findById(id);
        if (!campground) {
            throw new AppError('CANNOT FIND PAGE', 404)
        } else {
            res.render('campgrounds/show', { campground })
        }
    } catch (error) {
        next(error)
    }
}))

app.put("/campground/:id", async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.redirect(302, `/campground/${campground._id}`);
})

app.delete("/campground/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedCamp = await Campground.findByIdAndDelete(id);
        if (!deletedCamp) {
            throw next(new AppError('CANNOT DELETE CAMP', 404))
        } else {
            console.log(`deleted ${JSON.stringify(deletedCamp)}`)
            res.redirect(302, "/campground")
        }
    } catch (error) {
        next(error)
    }
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    res.status(status).render('404');
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
