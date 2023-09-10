const { campground } = require("../models/camp");
const { cloudinary } = require("../Cloudinary");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxClient = mbxClient({ accessToken: process.env.MAP_BOX_TOKEN });

module.exports.getRoot = async (req, res) => {
    const camps = await campground.find({});
    res.render("campground/index", { camps });
}

module.exports.createCampground = async (req, res) => {
    const campData = req.body;
    const camp = new campground({ ...campData.campground, owner: req.user._id });
    camp.images = req.files.map(image => {
        return {
            filename: image.filename,
            imageURL: image.path
        };
    })
    const geometry = await mapBoxClient.forwardGeocode({ query: campData.campground.location, limit: 1 }).send();
    if (!geometry.body.features.length) {
        req.flash("error", "Invalid location, correct format: City, Country an example: Paris, France ");
        res.redirect("/campground/new");
    }
    camp.geometry = geometry.body.features[0].geometry;
    await camp.save();
    req.flash("success", "successfully added campground");
    res.redirect(`/campground/${camp._id}`);
}

module.exports.getCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id).populate({ path: "reviews", populate: { path: "owner" } }).populate("owner");
    if (!camp) {
        req.flash("error", `Campground with id ${id} not found`);
        return res.redirect("/campground");
    }
    res.render("campground/show", { camp });
}

module.exports.renderNewCampgroundForm = (req, res) => {
    res.render("campground/new");
}

module.exports.renderCampgroundEditForm = async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp) {
        req.flash("error", `Campground with id ${id} not found`);
        res.redirect("/campground");
    }
    res.render("campground/edit", { camp });
}

module.exports.editCampgroundData = async (req, res) => {

    const { id } = req.params;
    const campData = req.body;
    const camp = await campground.findByIdAndUpdate(id, { ...campData.campground });
    if (!camp) {
        req.flash("error", `Campground with id ${id} not found`);
        res.redirect("/campground");
    }
    const newImages = req.files.map(image => {
        return {
            filename: image.filename,
            imageURL: image.path
        };
    });
    camp.images.push(...newImages);
    if (req.body.deletedImages && req.body.deletedImages.length) {
        for (let image of req.body.deletedImages) {
            await cloudinary.uploader.destroy(image);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deletedImages } } } });
    }
    const geometry = await mapBoxClient.forwardGeocode({ query: campData.campground.location, limit: 1 }).send();
    if (!geometry.body.features.length) {
        req.flash("error", "Invalid location, correct format: City, Country an example: Paris, France ");
        res.redirect(`/campground/${camp._id}/edit`);
    }
    camp.geometry = geometry.body.features[0].geometry;
    await camp.save();
    req.flash("success", "successfully edited campground");
    res.redirect(`/campground/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findByIdAndDelete(id);
    if (!camp) {
        req.flash("error", `Campground with id ${id} not found`);
        res.redirect("/campground");
    }
    req.flash("success", "successfully deleted campground");
    res.redirect("/campground");
}