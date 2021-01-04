const path = require("path");

const express = require("express");
const db = require("../util/database");

const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');

router.get("/register", (req, res) => {
  res.render("register", {
    pageTitle: "register",
    path: "/register",
    formsCSS: true,
  });
});

router.post("/register-user", (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  
  const sql = "SELECT * FROM users WHERE users.email = ?";
  db.query(sql, [email], (err, rows) => {
    if (rows.length > 0) {
      req.flash("error", "E-Mail exists already, please pick a different one.");
      return res.redirect("/register");
    } else {
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User(firstName, lastName, email, hashedPassword);
          return user.save();
        })
        .then((result) => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  // handle validation ....
});

module.exports = router;
