import mongoose, { Schema } from "mongoose";
const schema = mongoose.schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number
})

export const Review = mongoose.model('Review',reviewSchema);