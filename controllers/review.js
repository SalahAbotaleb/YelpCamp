const { campground } = require("../models/camp");
const { review } = require("../models/review");

module.exports.redirectToOriginalCampground = (req, res) => {
    res.redirect(`/campground/${req.params.id}`)
}

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const reviewData = req.body;

    const userReview = new review({ ...reviewData.review, owner: req.user._id });
    const camp = await campground.findById(id);
    camp.reviews.push(userReview);
    await userReview.save();
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, revId } = req.params;

    await review.findByIdAndDelete(revId);
    await campground.findByIdAndUpdate(id, { $pull: { reviews: revId } });

    res.redirect(`/campground/${id}`);
}