const mongoose = require("mongoose");
const { campground } = require("../models/camp");
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
    for (let i = 0; i < 300; i++) {
        let randCity = randomItem(city);
        let randPrice = Math.floor(Math.random() * 1000);
        let newItem = new campground({
            location: `${randCity.city}, ${randCity.state}`,
            geometry: { type: 'Point', coordinates: [randCity.longitude, randCity.latitude] },
            title: `${randomItem(descriptors)} ${randomItem(places)}`,
            description: "In the heart of a lush forest, where the trees reach up towards the sky like ancient guardians, lies a campsite embraced by nature's enchantment. The camp is nestled amidst a sea of emerald foliage, creating a cocoon of serenity that beckons adventurers seeking respite from the cacophony of modern life.",
            price: randPrice,
            owner: "64f8c12a23001d03a6411320",
            images: [
                {
                    imageURL: 'https://res.cloudinary.com/dlspn2686/image/upload/v1694208151/campground_images/iftxprv8rljeqv4winzt.jpg',
                    filename: 'campground_images/iftxprv8rljeqv4winzt',
                },
                {
                    imageURL: 'https://res.cloudinary.com/dlspn2686/image/upload/v1694208160/campground_images/ken38udfmgtpl7jpvftr.jpg',
                    filename: 'campground_images/ken38udfmgtpl7jpvftr',
                }
            ]

        });
        await newItem.save();
    }
}
buildRandomData().then(() => {
    console.log("Random Data Done");
    db.close();
})
