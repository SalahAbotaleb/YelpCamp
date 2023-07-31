const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const campground = require("./models/camp");
const methodOverride = require("method-override");
const engine = require("ejs-mate");


const ExpressError = require("./utils/ExpressError");
const AsyncHandler = require("./utils/AsyncHandler");

const { campgroundSchema } = require("./campgroundSchema")
//mongoose open connection
mongoose.connect("mongodb://127.0.0.1:27017/YelpCamp");
const db = mongoose.connection;
db.once("connected", () => {
    console.log("Connecnted to Database");
})
db.on("error", (error) => {
    console.log("An error occured\n", error);
})

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const verifyCampgroundSchema = (req, res, next) => {
    const campData = req.body;
    const { error } = campgroundSchema.validate(campData);
    if (error) {
        const ErrorList = error.details.map(err => err.message).join(',')
        throw new ExpressError(ErrorList, 400);
    }
    next();
}

app.get("/", (req, res) => {
    res.send("Welcome");
});
app.get("/home", (req, res) => {
    res.render("home");
});
app.get("/campground", AsyncHandler(async (req, res) => {
    const camps = await campground.find({});
    res.render("campground/index", { camps });
}));
app.post("/campground", verifyCampgroundSchema, AsyncHandler(async (req, res) => {
    const camp = new campground({ ...campData.campground });
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
}));
app.get("/campground/new", (req, res) => {
    res.render("campground/new");
})
app.get("/campground/:id", AsyncHandler(async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findById(id);
    res.render("campground/show", { camp });
}));
app.get("/campground/:id/edit", AsyncHandler(async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findById(id);
    res.render("campground/edit", { camp });
}));
app.put("/campground/:id", verifyCampgroundSchema, AsyncHandler(async (req, res) => {

    const { id } = req.params;
    const campData = req.body;
    console.log(campData);
    const camp = await campground.findByIdAndUpdate(id, { ...campData.campground });
    console.log(camp);
    res.redirect(`/campground/${camp._id}`);
}));
app.delete("/campground/:id", AsyncHandler(async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findByIdAndDelete(id);
    res.redirect("/campground");
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

//error handling routine
app.use((error, req, res, next) => {
    if (!error.status) error.status = 500;
    res.render("error.ejs", { error });
})
app.listen("3000", () => {
    console.log("Server is up on port 3000");
});