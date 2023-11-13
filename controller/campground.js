import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";

export const index = async (req, res, next) => {
    const campground = await Campground.find({})
    if (!campground) {
        throw new AppError('CANNOT FIND PAGE', 404)
    } else {
        res.render('campgrounds/index', { campground })
    }
}

export const createCamp = async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id
    await newCamp.save();
    req.flash('success', 'successfully added a new campground')
    res.redirect(302, `/campground/${newCamp._id}`)
}