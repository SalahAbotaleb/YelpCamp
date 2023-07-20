const mongoose = require("mongoose");
const campground = require("../models/camp");
const city = require("./cities");
const { descriptors, places } = require("./seedHelpers");

//mongoose open connection
mongoose.connect("mongodb://127.0.0.1:27017/YelpCamp");
const db = mongoose.connection;
db.once("connected", () => {
    console.log("Connecnted to Database");
})
db.on("error", (error) => {
    console.log("An error occured\n", error);
})

//getting a random item from array
let randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
let buildRandomData = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let randCity = randomItem(city);
        let newItem = new campground({
            location: `${randCity.city}, ${randCity.state}`,
            title: `${randomItem(descriptors)} ${randomItem(places)}`
        });
        await newItem.save();
    }
}
buildRandomData().then(() => {
    console.log("Random Data Done");
    db.close();
})
