import express from "express";
import { validateReviewSchema } from "../util/validation.js"
import { Review } from "../models/review.js";
import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";
import { wrapAsync } from "../util/catchAsync.js";

const reviews = express.Router({mergeParams:true});

reviews.post("/", validateReviewSchema, wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    const newReview = new Review(req.body.review)
    campground.reviews.push(newReview);
    await newReview.save()
    await campground.save()
    res.redirect(302, `/campground/${campground.id}`)
}))

reviews.delete("/:reviewId", wrapAsync(async (req, res, next) => {
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

export {reviews}