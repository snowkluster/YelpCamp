import express from "express";
import { validateSchema } from "../util/validation.js"
import { wrapAsync } from "../util/catchAsync.js";
import { isLoggedIn } from "../middleware/middle.js";
import { createCamp, index } from "../controller/campground.js";


const router = express.Router({ mergeParams: true });

router.route('/')
    .post(isLoggedIn,validateSchema, wrapAsync(createCamp))
    .get(wrapAsync(index));

router.get('/new', isLoggedIn , (req, res) => {
    res.render('campgrounds/new')
})

export { router }