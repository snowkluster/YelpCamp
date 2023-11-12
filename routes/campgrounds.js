import express from "express";
import { validateSchema } from "../util/validation.js"
import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";
import { wrapAsync } from "../util/catchAsync.js";


const router = express.Router({mergeParams:true});

router.route('/')
    .post(validateSchema, wrapAsync(async (req, res, next) => {
        const newCamp = new Campground(req.body.campground);
        await newCamp.save();
        req.flash('success','successfully added a new campground')
        res.redirect(302, `/campground/${newCamp._id}`)
    }))
    .get(wrapAsync(async (req, res, next) => {
        const campground = await Campground.find({})
        if (!campground) {
            throw new AppError('CANNOT FIND PAGE', 404)
        } else {
            res.render('campgrounds/index', { campground })
        }
    }));

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

export { router }