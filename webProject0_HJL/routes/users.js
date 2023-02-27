var express = require("express");
const { password } = require("../db/dbconfig");
var router = express.Router();
var multer = require("multer"); // file feltöltéshez
var path = require("path"); // útvonalhoz

var verify = require("../middleware/verfyModule");
var Db = require("../db/dboperation");
const session = require("express-session");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, past.join(__dirname, "../public/Userprofile"));
  },
  filename: function (req, file, cb) {
    cb(null, req.session.user_id + "_" + file.originalname);
  },
});

var profil = multer({ storage: storage });
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/login", async function (req, res, next) {
  try {
    res.render("login", { session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/reg", async function (req, res, next) {
  try {
    res.render("reg", { session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/profil", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const resultElements = await Db.SelectOneUser(user_id);
    res.render("profil.ejs", { list: resultElements, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/profil/valtoztat", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const resultElements = await Db.SelectOneUser(user_id);
    res.render("valtoztat", { list: resultElements, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.post("/profil/valtoztat", async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let neve = req.body.fullname;
  let Profilkep = req.body.Profilkep;
  const resultElements = await Db.UpdateUser(username, password, neve, email);

  if (resultElements.length == 0) res.redirect("/profil/valtoztat");
  else {
    req.session.user_id = resultElements.insertId;
    req.session.name = username;
    res.redirect("/profil");
  }
});
router.post("/login", async function (req, res, next) {
  let username = req.body.Username;
  let password = req.body.Password;

  const resultElements = await Db.VerifyUser(username, password);

  if (resultElements.length == 0) res.send("Hibás belépés");
  else {
    req.session.Jogosultsag = resultElements[0].Jogosultsag;
    req.session.user_id = resultElements[0].id;
    req.session.name = resultElements[0].Username;
    req.session.profilkep = resultElements[0].Profilkep;
    res.redirect("/filmek");
  }
});
router.post("/reg", async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let neve = req.body.fullname;
  let passwrodConf = req.body.passwordConfirm;
  if (passwrodConf === password) {
    const resultElements = await Db.InsertUser(username, password, neve, email);
    if (resultElements.length == 0) res.redirect("/reg");
    else {
      const login = await Db.VerifyUser(username, password);
      req.session.user_id = resultElements.insertId;
      req.session.name = username;
      req.session.Jogosultsag = login[0].Jogosultsag
      res.redirect("/filmek");
    }
  }

  
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/filmek");
});
//CONCAT('*', UPPER(SHA1(UNHEX(SHA1('mypass')))))
module.exports = router;
