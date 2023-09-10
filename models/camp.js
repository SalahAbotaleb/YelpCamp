const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema references mongoose.Schema
const { review } = require("./review");
const { cloudinary } = require("../Cloudinary");
const imageSchema = new Schema({
    imageURL: String,
    filename: String
})
const options = {
    toJSON: { virtuals: true } // <-- include virtuals in `JSON.stringify()`
}
const campgroundSchema = new Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    price: {
        type: Number,
        min: 0
    },
    description: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: {
        type: String
    }
    , owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    images: [imageSchema],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
}, options);
imageSchema.virtual("imageThumbnailURL").get(function () {
    return this.imageURL.replace("/upload", "/upload/w_200");
})
campgroundSchema.virtual("properties.popupHTML").get(function () {
    return `<b><a class="link-primary link-underline-opacity-0" href=/campground/${this._id}>${this.title}</a></b>`
})
campgroundSchema.post("findOneAndDelete", async (camp) => {
    const { reviews } = camp;
    if (reviews.length) {
        await review.deleteMany({ _id: { $in: reviews } });
    }
    for (let image of camp.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
})
const campgroundModel = new mongoose.model("Camp", campgroundSchema);
module.exports.campground = campgroundModel;