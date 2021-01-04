const path = require("path");
const express = require("express");
const db = require("../util/database");
const router = express.Router();
const bcrypt = require("bcryptjs");


router.get("/", (req, res, next) => {
  if (req.session.isLoggedin) return res.redirect("/profile");

  res.render("login", {
    pageTitle: "login",
    path: "/",
    formsCSS: true,
  });
});
router.post("/login-user", (req, res, next) => {
  const email = req.body.email.trim();
  const password = req.body.password;
  const sql = "SELECT * FROM users WHERE users.email = ?";

  db.query(sql, [email], (err, rows) => {
    const user = rows[0];
    if (!user) {
      // req.flash("error", "Invalid email");
      console.log("Invalid email");
      return res.json({ message: "please Login first" });
    }

    bcrypt.compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.email = user.email;
          req.session.firstName = user.firstName;
          req.session.lastName = user.lastName;
          req.session.isLoggedin = true;
          return req.session.save((err) => {
            res.redirect("/profile");
          });
        }
        return res.json({ message: "Invalid password." });

        // req.flash("error", "Invalid password.");
        // console.log("Invalid password")
        // res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        return res.json({ message: "something wrong" });

        // res.redirect("/");
      });
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
