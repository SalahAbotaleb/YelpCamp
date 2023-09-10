const { campground } = require("../models/camp");
const { review } = require("../models/review");
const { campgroundSchema, reviewSchema } = require("../schemaValidation");
const ExpressError = require("../utils/expressError");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}
async function isAuth(req, res, next) {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (req.user && camp.owner.equals(req.user._id)) {
        return next();
    }
    req.flash("error", "You are not authorized");
    res.redirect("/campground");
}
async function isReviewOwner(req, res, next) {
    const { revId } = req.params;
    const reviewObj = await review.findById(revId);
    if (req.user && reviewObj.owner.equals(req.user._id)) {
        return next();
    }
    req.flash("error", "You are not authorized");
    res.redirect("/campground");
}
function registerPath(req, res, next) {
    if (req.session.returnTo) {
        res.locals.originalUrl = req.session.returnTo;
    }
    next();
}

const verifyCampgroundSchema = (req, res, next) => {
    const campData = req.body;
    console.log(req.body);
    console.log("ok");
    const { error } = campgroundSchema.validate(campData);
    if (error) {
        const ErrorList = error.details.map(err => err.message).join(',');
        throw new ExpressError(ErrorList, 400);
    }
    next();
}

const verifyReviewSchema = (req, res, next) => {
    const campData = req.body;
    const { error } = reviewSchema.validate(campData);
    if (error) {
        const ErrorList = error.details.map(err => err.message).join(',')
        throw new ExpressError(ErrorList, 400);
    }
    next();
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.registerPath = registerPath;
module.exports.isAuth = isAuth;
module.exports.isReviewOwner = isReviewOwner;
module.exports.verifyCampgroundSchema = verifyCampgroundSchema;
module.exports.verifyReviewSchema = verifyReviewSchema;