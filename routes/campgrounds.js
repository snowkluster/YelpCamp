import express from "express";
import { wrapAsync } from "../util/catchAsync.js";
import { isLoggedIn } from "../middleware/middle.js";
import { createCamp, index } from "../controller/campground.js";
import multer from "multer"
import { storage} from "../env/cloud.js";

const upload = multer({ storage: storage })
const router = express.Router({ mergeParams: true });

router.route('/')
    .post(isLoggedIn,upload.array('image'), wrapAsync(createCamp))
    .get(wrapAsync(index));

router.get('/new', isLoggedIn , (req, res) => {
    res.render('campgrounds/new')
})

export { router }