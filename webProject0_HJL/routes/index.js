const { constants } = require('buffer');
var express = require('express');
var router = express.Router();
var path = require('path');      // útvonalhoz

var Db = require('../db/dboperation');
var verify= require('../middleware/verfyModule')
/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index.ejs', { session : req.session});

});

router.get('/kereses', async (req, res, next) => {
  try {
    res.render('kereses.ejs',{session: req.session})
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
    res.render('card.ejs',{list:resultElements, session: req.session})
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});


router.get('/film/:id', async (req, res, next) => {
  try {
    const movieId=req.params.id;
    const resultElements = await Db.SelectOne(movieId);
    const szineszkapcsolo = await Db.SelectActors(movieId);
    const kategoriakapcsolo = await Db.SelectCategory(movieId);
    res.render('adatlap.ejs',{list:resultElements,szineszek:szineszkapcsolo,kategoria:kategoriakapcsolo,session: req.session,})
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

module.exports = router;
