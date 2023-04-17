var express = require("express");
const { password } = require("../db/dbconfig");
var router = express.Router();
var multer = require("multer"); // file feltöltéshez
var path = require("path"); // útvonalhoz

var verify = require("../middleware/verfyModule");
var Db = require("../db/dboperation");
var userController = require("../controller/user.controller");

router.get("/userlist/:page",[verify.checkLogged,verify.checkAdmin], userController.allusers 
);
module.exports = router;
