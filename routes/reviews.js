const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../controllers/review")

const AsyncHandler = require("../utils/asyncHandler");
const { isLoggedIn, isReviewOwner, verifyReviewSchema } = require("../utils/middleware");


router.route("/")
    .get(review.redirectToOriginalCampground)
    .post(isLoggedIn, verifyReviewSchema, AsyncHandler(review.addReview));

router.delete("/:revId", isLoggedIn, isReviewOwner, AsyncHandler(review.deleteReview));

module.exports = router;