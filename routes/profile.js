const express = require("express");
const db = require("../util/database");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/Profile", (req, res, next) => {
  if (req.session.isLoggedin) {
    const firstName = req.session.firstName;
    const lastName = req.session.lastName;
    const email = req.session.email;
    const user = {
      firstName,
      lastName,
      email,
    };
    res.render("profile", {
      data:null,
      user: user,
      pageTitle: "login",
      path: "/Profile",
      profileCSS: true,
    });
  } else {
    res.redirect("/");
  }
});


router.get("/showProfile", (req, res, next) => {
  if (req.session.isLoggedin) {
    const firstName = req.session.firstName;
    const lastName = req.session.lastName;
    const email = req.session.email;
    const user = {
      firstName,
      lastName,
      email,
    };
    res.render("showProfile", {
      data:null,
      user: user,
      pageTitle: "login",
      path: "/showProfile",
      profileCSS: true,
    });
  } else {
    res.redirect("/");
  }
});




router.post("/showProfile", (req, res, next) => { 
  const sql = "SELECT * FROM users";
  db.query(sql, (err, rows) => {
    if (err) return false;
    else
    console.log(  rows);  
    string =JSON.stringify(rows)
    var users =  JSON.parse(string);
    console.log(users);
      res.render("showProfile", {
        data:users,
        path:"/showProfile",
        formsCSS: true,
        pageTitle:"showProfile"    
          });
   
});
});






router.get("/updateProfile", (req, res, next) => {
  if (req.session.isLoggedin) {
    const firstName = req.session.firstName;
    const lastName = req.session.lastName;
    const email = req.session.email;
    const user = {
      firstName,
      lastName,
      email,
    };
    res.render("updateProfile", {
      user: user,
      pageTitle: "login",
      path: "/updateProfile",
      profileCSS: true,
    });
  } else {
    res.redirect("/");
  }
});



router.post("/updateProfile", (req, res, next) => {
  if (req.session.isLoggedin) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const email = req.session.email;

    if (!firstName || !lastName || !password)
      return res.json({ message: "please fill all fields" });

    return bcrypt.hash(password, 12)
      .then((hashedPassword) => {
        const sql =
          "UPDATE users SET firstName= ?,lastName= ? , password= ? WHERE users.email = ?";
        db.query(sql, [firstName, lastName, hashedPassword, email], (err) => {
          if (err) return res.json({ message: "update went wrong" });
        });
      })
      .then(() => {
        req.session.firstName = firstName;
        req.session.lastName = lastName;
        res.redirect("/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    return res.json({ message: "please Login first" });
  }
});





router.get("/deleteProfile", (req, res, next) => {
  if (req.session.isLoggedin) {
    const firstName = req.session.firstName;
    const lastName = req.session.lastName;
    const email = req.session.email;
    const user = {
      firstName,
      lastName,
      email,
    };
    res.render("deleteProfile", {
      data:null,
      user: user,
      pageTitle: "deleteProfile",
      path: "/Profile",
      profileCSS: true,
    });
  } else {
    res.redirect("/");
  }
});
router.post("/deleteProfile", (req, res, next) => {
  if (req.session.isLoggedin) {
   
    const password = req.body.password;
    const email = req.session.email;

    return bcrypt.hash(password, 12)
      .then((hashedPassword) => {
      
        const sql = "DELETE FROM users WHERE users.email = ?";
        db.query(sql, [ email], (err) => {
          if (err) return res.json({ message: "delete went wrong" });
        });
      })
      .then(() => {
        req.session.destroy(function(err){
          if(err){
          console.log(err);
          }
          else{
          res.redirect('/');
          }
          });
    
        res.redirect("/");
      })
      
      .catch((err) => {
        console.log(err);
      });
  } else {
    return res.json({ message: "please Login first" });
  }
});














module.exports = router;
