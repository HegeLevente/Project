var express = require('express');
const { password } = require('../db/dbconfig');
var router = express.Router();
var multer = require('multer');  // file feltöltéshez
var path = require('path');      // útvonalhoz

var verify= require('../middleware/verfyModule')
var Db = require('../db/dboperation');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/profil'))
  },
  filename: function (req, file, cb) {
    cb(null, "profil_" + file.originalname)
  }
});

var profil = multer({ storage: storage })

/* Új felhasználó. */
router.post('/regisztracio',profil.single('uploaded_file'), async function (req, res, next) {
    try {
      let kepnev = req.file.filename;
      let username = req.body.username;
      let password = req.body.password;
      let name = req.body.name;
      let email = req.body.email;
    
      const resultElements = await Db.InsertUser(username,password,name,email,kepnev);
      res.render('ujkep', { kateg: resultElements }); // template
      //req.session.user_id = resultElements.insertId;   // Login OK   

      const resultElements2 = await Db.VerifyUser(username,password);
      req.session.name    = resultElements2[0].name;
      res.redirect('/kepek');

    } catch (e) {
      console.log(e); // console.log - Hiba esetén.
      res.sendStatus(500);
    }
  }
);

router.post('/login', async function(req, res, next) {
  let username = req.body.Username;
  let password = req.body.Password;
  
  const resultElements = await Db.VerifyUser(username,password);

  if(resultElements.length == 0)
      res.send('Hibás belépés')
  else 
   {
    req.session.user_id    = resultElements[0].id;
    req.session.name      = resultElements[0].Username;
    res.redirect('/Kereses.html');
}

});


router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.send('Logout OK');
});


//CONCAT('*', UPPER(SHA1(UNHEX(SHA1('mypass')))))



module.exports = router;
