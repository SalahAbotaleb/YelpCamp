const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const campground = require("./models/camp");

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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.send("Welcome");
});
app.get("/home", (req, res) => {
    res.render("home.ejs");
});
app.get("/campground", async (req, res) => {
    const item = new campground({ name: "CU", price: "20" });
    console.log(item);
    await item.save();
    res.send(item);
});
app.listen("3000", () => {
    console.log("Server is up on port 3000");
});