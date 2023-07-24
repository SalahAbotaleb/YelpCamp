const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Schema references mongoose.Schema
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
    location: {
        type: String
    },
    image: {
        type: String
    }
});
const campgroundModel = new mongoose.model("Camp", campgroundSchema);
module.exports = campgroundModel;