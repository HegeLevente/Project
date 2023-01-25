var express = require('express');
var router = express.Router();
var multer = require('multer');  // file feltöltéshez
var path = require('path');      // útvonalhoz

var Db = require('../db/dboperation');


router.get('/varosok/:page', async (req, res, next) => {
  try {
    pageNo = req.params.page-1;
    if(pageNo<1 || isNaN(pageNo)){ pageNo=0}
    const resultElements = await Db.SelectFilm(pageNo);
    //res.json(resultElements);
    res.render('kereses.ejs',{list:resultElements})
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

router.get('/kereses/:page', async (req, res, next) => {
  try {
    pageNo = req.params.page-1;
    if(pageNo<1 || isNaN(pageNo)){ pageNo=0}
    const resultElements = await Db.SelectFilmek(pageNo);
    //res.json(resultElements);
    res.render('kereses.ejs',{list:resultElements})
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
/* GET home page. */
router.get('/', function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
  res.render('index', { title: 'Express',ip:ip });
});

/* Új kép. */
router.get('/ujkep', async function (req, res, next) {
  if (req.session.user_id) {
    try {
      const resultElements = await Db.SelectKategoria();
      res.render('ujkep', { kateg: resultElements }); // template
    } catch (e) {
      console.log(e); // console.log - Hiba esetén.
      res.sendStatus(500);
    }
  }
  else {
    res.redirect('/login.html');
  }
});

router.get('/kepek', async (req, res, next) => {
    try {
      kateg_id = 1;
      const resultElements = await Db.SelectFilm(0);
      const kategoriak = await Db.SelectKategoria();
      // res.status(200).json(resultElements); // json válasz küldése
      res.render('kepek', { list: resultElements, kateg: kategoriak, kateg_id: kateg_id, username: req.session.name, profilkep: req.session.profilkep }); // template
    } catch (e) {
      console.log(e); // console.log - Hiba esetén.
      res.sendStatus(500);
    }
});

router.post('/kepszures', async (req, res, next) => {
  try {
    kateg_id = req.body.kateg;
    const resultElements = await Db.SelectKepekFiltered(kateg_id);
    const kategoriak = await Db.SelectKategoria();
    // res.status(200).json(resultElements); // json válasz küldése
    res.render('kepek', { list: resultElements, kateg: kategoriak, kateg_id: kateg_id }); // template
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, "kep_" + file.originalname)
  }
});

var upload = multer({ storage: storage })

//const datetime = new Date().toJSON().slice(0, 19).replace('T', ' ')
//console.log(datetime) //2015-07-23 11:26:00

router.post('/kep_upload', upload.single('uploaded_file'), async (req, res, next) => {
  if(req.session.user_id){
  kepnev = req.file.filename;
  kateg_id = req.body.kateg;
  megnev = req.body.megnev;
  user_id = req.session.user_id;
  const resultElements = await Db.InsertKep(kepnev, kateg_id, user_id, megnev);

  console.log(req.file, req.body)
  console.log(req.body.kateg);
  console.log(req.file); //a feltöltött fájl adatai - json (originalname)
  //res.send('OK'); 
  res.redirect('/kepek')
  }
  else
  {
    res.redirect('login.html')
  }
});

module.exports = router;
