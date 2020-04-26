const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

var isUserLoggedin = (req, res, next) => {
  if (!req.session.userid) {
    req.flash("error_message", "Please login first!!!!");
    res.redirect("/login");
  } else {
    next();
  }
};

router.get("/", userController.index);

router.get("/createNewPost", isUserLoggedin, userController.getPost);

router.post("/createNewPost", isUserLoggedin, userController.post);

router.get("/dashboard", isUserLoggedin, userController.dashboard);

router.get("/postinfo", isUserLoggedin, userController.getPostInfo);

router.get("/edit/:id", isUserLoggedin, userController.getEdit);

router.post("/edit/:id", isUserLoggedin, userController.postEdit);

router.get("/delete/:id", isUserLoggedin, userController.delete);

router.get("/register", isUserLoggedin, userController.getRegister);

router.post("/register", isUserLoggedin, userController.postRegister);

router.get("/login", userController.getLogin);

router.post("/login", userController.postLogin);

router.get("/logout", isUserLoggedin, userController.logout);

router.get("/detail/:id", userController.detail);

router.get("/about", userController.about);

router.get("/contact", userController.contact);

module.exports = router;
