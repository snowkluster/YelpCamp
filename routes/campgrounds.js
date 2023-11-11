import express from "express";
import { campgroundSchema, reviewSchema } from "../schema/schema.js";
import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";
import { wrapAsync } from "../util/catchAsync.js";
import { Review } from "../models/review.js";

const router = express.Router();

router.post("/", validateSchema, wrapAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(302, `/${newCamp._id}`)
}))

router.get("/", wrapAsync(async (req, res, next) => {
    const campground = await Campground.find({})
    if (!campground) {
        throw new AppError('CANNOT FIND PAGE', 404)
    } else {
        res.render('campgrounds/index', { campground })
    }
}));

router.get('/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.get("/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground })
}))

router.put("/:id", validateSchema, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.redirect(302, `/${campground._id}`);
}))

router.post("/:id/reviews", validateReviewSchema, wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    console.log(req.body.review)
    const newReview = new Review(req.body.review)
    campground.reviews.push(newReview);
    await newReview.save()
    await campground.save()
    res.redirect(302, `/${campground.id}`)
}))

router.delete("/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedCamp = await Campground.findByIdAndDelete(id);
        if (!deletedCamp) {
            throw next(new AppError('CANNOT DELETE CAMP', 404))
        } else {
            console.log(`deleted ${JSON.stringify(deletedCamp)}`)
            res.redirect(302, "/")
        }
    } catch (error) {
        next(error)
    }
}))

router.delete("/:id/reviews/:reviewId",wrapAsync(async(req,res,next)=>{
    const {id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews : reviewId}})
    const deleteReview = await Review.findByIdAndDelete(reviewId);
    if (!deleteReview) {
        throw next(new AppError('CANNOT DELETE CAMP', 404))
    } else {
        console.log(`deleted ${JSON.stringify(deleteReview)}`)
        res.redirect(302, `/${id}`)
    }
}))

function validateSchema(req, res, next) {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        throw new AppError("CANNOT VALIDATE", 403)
    } else {
        next()
    }
}

function validateReviewSchema(req, res, next) {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        throw new AppError("CANNOT VALIDATE REVIEW", 403)
    } else {
        next()
    }
}

export { router }