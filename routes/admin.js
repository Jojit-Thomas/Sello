var express = require("express");
const {
  getAllUsers,
  registerUser,
  deleteUser,
  getUserDetails,
  updateUser,
  doLogin,
} = require("../helpers/admin-user-helpers");
const {
  addProduct,
  getAllProducts,
  deleteProducts,
  getProducts,
} = require("../helpers/product-helpers");
var router = express.Router();

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

router.get("/login", (req, res) => {
  // res.render("admin/login",{admin:true});
  if (req.session.adminLoggedIn) {
    res.redirect("/admin");
  } else {
    res.set("Cache-Control", "no-store");
    res.render("admin/login", { error: req.session.loginErr, noHeader: true });
    req.session.loginErr = null;
  }
});

router.post("/login", (req, res) => {
  doLogin(req.body).then((response) => {
    if (response.status) {
      console.log(response);
      req.session.adminLoggedIn = true;
      req.session.admin = response.admin;
      res.redirect("/admin");
    } else {
      console.log(response);
      req.session.loginErr = "Username or password incorrect";
      res.redirect("/admin/login");
    }
  });
});

router.use((req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin/login");
  }
});

// ======================== VALIDATION REQUIRED =================================================
/* GET home page. */
router.get("/", function (req, res, next) {
  getAllProducts().then((products) => {
    res.render("admin/view-products", { items: products, admin: true });
  });
});
router.get("/logout", (req, res) => {
  req.session.adminLoggedIn = false;
  req.session.admin = null;
  res.redirect("/admin");
});
router.get("/add-product", (req, res) => {
  res.render("admin/add-product", { admin: true });
});
router.post("/add-product", (req, res) => {
  addProduct(req.body, (result) => {
    const image = req.files.image;
    image.mv(`./public/product-images/${result}.aivf`, (err, done) => {
      if (!err) res.render("admin/add-product", { admin: true });
      else console.log(err);
    });
  });
  res.redirect("/admin");
});
router.get("/delete-product/:id", (req, res) => {
  deleteProducts(req.params).then((result) => {
    res.redirect("/admin");
  });
});
router.get("/edit-product/:id", (req, res) => {
  getProducts(req.params.id, (result) => {
    res.render("admin/edit-product", { admin: true });
  });
});
router.get("/users", (req, res) => {
  getAllUsers(req.body).then((users) => {
    res.render("admin/view-users", { users, admin: true });
  });
});
router.get("/add-user", (req, res) => {
  res.render("admin/add-user", { admin: true });
});
router.post("/add-user", (req, res) => {
  registerUser(req.body).then((response) => {
    if (response.success) {
      res.status(200).redirect("/admin/users");
    } else {
      res.status(404).send({ message: response.error });
    }
  });
});
router.get("/delete-user/:id", (req, res) => {
  deleteUser(req.params.id).then((response) => {
    console.log(response);
    res.redirect("/admin/users");
  });
});
router.get("/edit-user/:id", (req, res) => {
  getUserDetails(req.params.id).then((user) => {
    res.render("admin/edit-user", {
      user: user,
      admin: true,
      error: req.session.editErr,
    });
    req.session.editErr = null;
  });
});
router.post("/edit-user/:id", (req, res) => {
  console.log("second");
  updateUser(req.params.id, req.body).then((response) => {
    if (response.status) {
      res.redirect("/admin/users");
    } else {
      console.log(response);
      req.session.editErr = response.error;
      res.redirect(`/admin/edit-user/${req.params.id}`);
    }
  });
});
module.exports = router;
