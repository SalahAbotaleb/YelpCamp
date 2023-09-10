const { user } = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("user/register");
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new user({ username, email });
        await user.register(newUser, password);
        req.login(newUser, (err) => {
            if (err) throw err;
            req.flash("success", `User ${newUser.username} registered successfully`);
            res.redirect("/campground");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
}

module.exports.renderUserLoginForm = (req, res) => {
    res.render("user/login");
}

module.exports.redirectUserAfterLogin = (req, res) => {
    req.flash("success", `Welcome ${req.user.username} !!`);
    const redirectURL = res.locals.originalUrl || '/campground';
    res.redirect(redirectURL);
}

module.exports.logoutUser = (req, res) => {
    req.logOut((err => {
        if (err) {
            req.flash("error", "error can't logout");
            return res.redirect("/campground");
        }
        req.flash("success", "successfully logout");
        res.redirect("/campground");
    }));

}