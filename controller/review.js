import { Review } from "../models/review.js";
import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";

export const newReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    const newReview = new Review(req.body.review)
    newReview.author = req.user._id
    campground.reviews.push(newReview);
    await newReview.save()
    await campground.save()
    req.flash('success','successfully added a new review')
    res.redirect(302, `/campground/${campground.id}`)
}

export const deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    const deleteReview = await Review.findByIdAndDelete(reviewId);
    if (!deleteReview) {
        throw next(new AppError('CANNOT DELETE CAMP', 404))
    } else {
        console.log(`deleted ${JSON.stringify(deleteReview)}`)
        req.flash('errors','deleted a user review')
        res.redirect(302, `/campground/${id}`)
    }
}