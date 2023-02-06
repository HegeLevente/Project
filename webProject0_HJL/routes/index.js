const { constants } = require('buffer');
var express = require('express');
var router = express.Router();
var path = require('path');      // útvonalhoz

var Db = require('../db/dboperation');
var verify= require('../middleware/verfyModule')
/* GET home page. */
router.get('/', function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
  res.render('index', { title: 'Express',ip:ip });
});

router.get('/kereses', async (req, res, next) => {
  try {
    res.render('kereses.ejs')
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
    res.render('card.ejs',{list:resultElements})
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});



module.exports = router;
