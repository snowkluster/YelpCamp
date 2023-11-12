import express from "express";
import { validateSchema } from "../util/validation.js"
import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";
import { wrapAsync } from "../util/catchAsync.js";

const ids = express.Router({mergeParams:true});

ids.get('/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

ids.route("/")
    .get(wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate('reviews');
        res.render('campgrounds/show', { campground })
    }))
    .put(validateSchema, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true, runValidators: true })
        req.flash('success','successfully updated campground information')
        res.redirect(302, `/campground/${campground._id}`);
    }))
    .delete(wrapAsync(async (req, res, next) => {
        const { id } = req.params;
            const deletedCamp = await Campground.findByIdAndDelete(id);
            if (!deletedCamp) {
                throw next(new AppError('CANNOT DELETE CAMP', 404))
            } else {
                console.log(`deleted ${JSON.stringify(deletedCamp)}`)
                req.flash('errors','successfully deleted a campground')
                res.redirect(302, "/campground")
            }
    }))

export {ids}
