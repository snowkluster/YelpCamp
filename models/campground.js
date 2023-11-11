import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
        required: true
    }]
});

export const Campground = mongoose.model('Campground', CampgroundSchema);
