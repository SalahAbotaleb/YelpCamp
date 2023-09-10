if (process.env.NODE_ENV != "Production") {
    require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const methodOverride = require("method-override");
const engine = require("ejs-mate");

const ExpressError = require("./utils/expressError");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const passport = require("passport");
const passportLocal = require("passport-local");

const { user } = require("./models/user");

const session = require("express-session");
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { directives } = require("./security");

const mongoStore = require("connect-mongo");
const MongoStore = require("connect-mongo");
//mongoose open connection
const mongoURL = "mongodb://127.0.0.1:27017/YelpCamp";
//"mongodb://127.0.0.1:27017/YelpCamp"
mongoose.connect(mongoURL);
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
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "publics")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives
    })
);

const store = MongoStore.create({
    mongoUrl: mongoURL,
    touchAfter: 24 * 3600
});
const sessionConfiguration = {
    store,
    name: "sesion",
    secret: "ThisIsSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
};

app.use(session(sessionConfiguration));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req, res, next) => {
    const error = req.flash("error");
    const success = req.flash("success");

    res.locals.currentUser = req.user;
    res.locals.success = success;
    res.locals.error = error;
    next();
});

app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


app.get("/", (req, res) => {
    res.redirect("/home");
});
app.get("/home", (req, res) => {
    res.render("home");
});

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