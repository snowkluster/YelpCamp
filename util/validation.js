import { campgroundSchema, reviewSchema } from "../schema/schema.js";

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

export {validateReviewSchema, validateSchema}