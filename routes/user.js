var express = require("express");
const { getAllProducts } = require("../helpers/product-helpers");
const { doSignup, doLogin } = require("../helpers/user-helpers");
var router = express.Router();

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user;
  if (user) {
    getAllProducts().then((products) => {
      res.render("user/index", { items: products, user });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { error: req.session.loginErr, noHeader: true });
    req.session.loginErr = null;
  }
});

router.post("/login", (req, res) => {
  doLogin(req.body).then((response) => {
    if (response.status) {
      console.log(response);
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      console.log(response);
      req.session.loginErr = "Username or password incorrect";
      res.redirect("/login");
    }
  });
});

router.get("/signup", (req, res) => {
  // console.log(">>>>",req.session.signupErr);
  res.render("user/signup", {error: req.session.signupErr,noHeader: true});
  req.session.signupErr = null;
});

router.post("/signuped", (req, res) => {
  doSignup(req.body).then((response) => {
    console.log(response);
    if (response.status) {
      res.status(200).redirect("/login");
    } else {
      res.status(404).send({message: response.error});
      // req.session.signupErr = response.error;
      // console.log('start')
      // res.redirect("/signup");
      // console.log('last')
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect("/");
});
module.exports = router;
