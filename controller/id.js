import { Campground } from "../models/campground.js";
import { AppError } from "../util/error.js";

export const editCamp = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}

export const showCamp = async (req, res, next) => {
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
}

export const putCamp = async (req, res, next) => {
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
}

export const deleteCamp = async (req, res, next) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    if (!deletedCamp) {
        throw next(new AppError('CANNOT DELETE CAMP', 404))
    } else {
        console.log(`deleted ${JSON.stringify(deletedCamp)}`)
        req.flash('errors','successfully deleted a campground')
        res.redirect(302, "/campground")
    }
}