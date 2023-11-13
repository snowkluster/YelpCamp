import express from "express";
import { validateSchema } from "../util/validation.js"

import { wrapAsync } from "../util/catchAsync.js";
import { isAuthor, isLoggedIn } from "../middleware/middle.js";
import { deleteCamp, editCamp, putCamp, showCamp } from "../controller/id.js";

const ids = express.Router({mergeParams:true});

ids.get('/edit', isLoggedIn,isAuthor,wrapAsync(editCamp))

ids.route("/")
    .get(wrapAsync(showCamp))
    .put(isAuthor,isLoggedIn,validateSchema, wrapAsync(putCamp))
    .delete(isAuthor,wrapAsync(deleteCamp))

export {ids}
