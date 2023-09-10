const express = require("express");
const router = express.Router();
const campground = require("../controllers/campground");
const AsyncHandler = require("../utils/asyncHandler");
const { isLoggedIn, isAuth, verifyCampgroundSchema } = require("../utils/middleware");

const multer = require("multer");
const { storage } = require("../Cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(AsyncHandler(campground.getRoot))
    .post(isLoggedIn, upload.array("images"), verifyCampgroundSchema, AsyncHandler(campground.createCampground));

router.get("/new", isLoggedIn, campground.renderNewCampgroundForm);

router.route("/:id")
    .get(AsyncHandler(campground.getCampground))
    .put(isLoggedIn, isAuth, upload.array("images"), verifyCampgroundSchema, AsyncHandler(campground.editCampgroundData))
    .delete(isLoggedIn, isAuth, AsyncHandler(campground.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuth, AsyncHandler(campground.renderCampgroundEditForm));

module.exports = router;