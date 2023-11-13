import { Campground } from "../models/campground.js";
import { Review } from "../models/review.js";


export function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('errors', 'Must be signed in')
        res.redirect('/login')
    }
    next()
}

export function storeReturnTo(req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

export async function isAuthor(req, res, next) {
    const { id } = req.params
    const check = await Campground.findById(id)
    if (!check.author.equals(req.user._id)) {
        req.flash('errors', 'You do not have permission')
        return res.redirect('/campground')
    }
    next()
}

export async function isReviewAuthor(req, res, next) {
    const {id, reviewId } = req.params
    const check = await Review.findById(reviewId)
    if (!check.author.equals(req.user._id)) {
        req.flash('errors', 'You do not have permission')
        return res.redirect(`/campground/${id}`)
    }
    next()
}