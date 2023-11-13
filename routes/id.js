import express from "express";
import { validateSchema } from "../util/validation.js"
import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";
import { wrapAsync } from "../util/catchAsync.js";
import { isAuthor, isLoggedIn } from "../middleware/middle.js";

const ids = express.Router({mergeParams:true});

ids.get('/edit', isLoggedIn,isAuthor,wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

ids.route("/")
    .get(wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author')
        if(!campground){
            req.flash('errors','cannot find that campground')
            res.redirect('/campground')
        }
        res.render('campgrounds/show', { campground })
    }))
    .put(isAuthor,isLoggedIn,validateSchema, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const check = await Campground.findById(id)
        if (!check.author.equals(req.user._id)){
            req.flash('errors','You do not have permission')
            return res.redirect('/campground')
        }
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true, runValidators: true })
        if(!campground){
            req.flash('errors','cannot find that campground')
            res.redirect('/campground')
        }
        req.flash('success','successfully updated campground information')
        res.redirect(302, `/campground/${campground._id}`);
    }))
    .delete(isAuthor,wrapAsync(async (req, res, next) => {
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
