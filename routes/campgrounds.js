import express from "express";
import { validateReviewSchema, validateSchema } from "../util/validation.js"
import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";
import { wrapAsync } from "../util/catchAsync.js";
import { Review } from "../models/review.js";

const router = express.Router();

router.route('/')
    .post(validateSchema, wrapAsync(async (req, res, next) => {
        const newCamp = new Campground(req.body.campground);
        await newCamp.save();
        res.redirect(302, `/${newCamp._id}`)
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

router.route("/:id")
    .get(wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate('reviews');
        res.render('campgrounds/show', { campground })
    }))
    .put(validateSchema, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        res.redirect(302, `/campground/${campground._id}`);
    }))
    .delete(wrapAsync(async (req, res, next) => {
        const { id } = req.params;
            const deletedCamp = await Campground.findByIdAndDelete(id);
            if (!deletedCamp) {
                throw next(new AppError('CANNOT DELETE CAMP', 404))
            } else {
                console.log(`deleted ${JSON.stringify(deletedCamp)}`)
                res.redirect(302, "/campground")
            }
    }))

router.post("/:id/reviews", validateReviewSchema, wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    console.log(req.body.review)
    const newReview = new Review(req.body.review)
    campground.reviews.push(newReview);
    await newReview.save()
    await campground.save()
    res.redirect(302, `/campground/${campground.id}`)
}))

router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    const deleteReview = await Review.findByIdAndDelete(reviewId);
    if (!deleteReview) {
        throw next(new AppError('CANNOT DELETE CAMP', 404))
    } else {
        console.log(`deleted ${JSON.stringify(deleteReview)}`)
        res.redirect(302, `/campground/${id}`)
    }
}))

export { router }