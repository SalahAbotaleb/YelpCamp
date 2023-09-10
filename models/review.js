const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema references mongoose.Schema
const reviewSchema = new Schema({
    body: {
        type: String
    },
    rating: {
        type: Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
const reviewModel = mongoose.model("Review", reviewSchema);
module.exports.review = reviewModel;