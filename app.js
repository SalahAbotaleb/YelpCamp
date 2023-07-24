const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const campground = require("./models/camp");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Welcome");
});
app.get("/home", (req, res) => {
    res.render("home");
});
app.get("/campground", async (req, res) => {
    const camps = await campground.find({});
    res.render("campground/index", { camps });
});
app.post("/campground", async (req, res) => {
    const campData = req.body;
    const camp = new campground({ ...campData.campground });
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
})
app.get("/campground/new", (req, res) => {
    res.render("campground/new");
})
app.get("/campground/:id", async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findById(id);
    res.render("campground/show", { camp });
});
app.get("/campground/:id/edit", async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findById(id);
    res.render("campground/edit", { camp });
});
app.put("/campground/:id", async (req, res) => {

    const { id } = req.params;
    const campData = req.body;
    console.log(campData);
    const camp = await campground.findByIdAndUpdate(id, { ...campData.campground });
    console.log(camp);
    res.redirect(`/campground/${camp._id}`);
});
app.delete("/campground/:id", async (req, res) => {

    const { id } = req.params;
    const camp = await campground.findByIdAndDelete(id);
    res.redirect("/campground");
});


app.listen("3000", () => {
    console.log("Server is up on port 3000");
});