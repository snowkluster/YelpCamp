import express from "express";
import { validateReviewSchema } from "../util/validation.js"
import { wrapAsync } from "../util/catchAsync.js";
import { isLoggedIn, isReviewAuthor } from "../middleware/middle.js";
import { deleteReview, newReview } from "../controller/review.js";

const reviews = express.Router({mergeParams:true});

reviews.post("/", isLoggedIn ,validateReviewSchema, wrapAsync(newReview))

reviews.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(deleteReview))

export {reviews}