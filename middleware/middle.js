export function isLoggedIn(req,res,next) {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('errors','Must be signed in')
        res.redirect('/login')
    }
    next()
}

export function storeReturnTo(req, res, next){
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
