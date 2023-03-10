const { constants } = require("buffer");
var express = require("express");
var router = express.Router();
var path = require("path"); // útvonalhoz

var Db = require("../db/dboperation");
var verify = require("../middleware/verfyModule");
/* GET home page. */
 const prevgage =""
router.get("/", async (req, res, next) => {
  const resultElements = await Db.SelectFilmekIndex();
  res.render("index.ejs", { list: resultElements, session: req.session });
});

router.get("/filmek", async (req, res, next) => {
  try {
    res.render("filmek.ejs", { session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/filmek/:page", async (req, res, next) => {
  try {
    pageNo = req.params.page - 1;
    if (pageNo < 1 || isNaN(pageNo)) {
      pageNo = 0;
    }
    const resultElements = await Db.SelectFilmek(pageNo);
    //res.json(resultElements);
    res.render("card.ejs", { list: resultElements, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/szures", async (req, res, next) => {
  try {
    const category = await Db.SelectKategoria();
    /*const actor = await Db.SelectSzinesz(nev);*/
    res.render("szures.ejs", { session: req.session, category: category });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/getActor/:nev", async (req, res, next) => {
  try {
    console.log("Belép");
    nev = req.params.nev;
    const actor = await Db.SelectSzinesz(nev);
    res.render("actor.ejs", { session: req.session, actor: actor });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.post("/szures", async (req, res, next) => {
  try {
    MagyarCim = req.body.MagyarCim;
    Rendezo = req.body.Rendezo;
    Ev = req.body.Ev;
    EredetiCim = req.body.EredetiCim;
    Kategoria = req.body.Kategoria;
    Szinesz = req.body.Szinesz;
    const resultElements = await Db.SearchFilm(
      MagyarCim,
      Rendezo,
      Ev,
      EredetiCim,
      Kategoria,
      Szinesz
    );
    res.render("talalatok", { list: resultElements, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.post("/kereses", async (req, res, next) => {
  try {
    Kereses = req.body.Kereses;
    const resultElements = await Db.SearchFilmAll(Kereses);
    res.render("talalatok", { list: resultElements, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.post("/addFavorite", async (req, res, next) => {
  try {
    if (req.session.user_id) {
      console.log(req.params.id)
      const favorite = await Db.InsertFavorite(req.session.user_id, req.params.id);
      res.redirect(req.session.previousURL)
    } else {
      res.render("login");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.post("/removeFavorite", async (req, res, next) => {
  try {
    if (req.session.user_id) {
      const favorite = await Db.DeleteFavorite(req.session.user_id, req.body.FilmID);
      res.redirect(req.session.previousURL)
    } else {
      res.render("login");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.get("/film/:id", async (req, res, next) => {
  try {
    req.session.previousURL= "/film/"+req.params.id;
    favorite=false;
    const movieId = req.params.id;
    const chechFav = await Db.SelectFavorite(req.session.id, movieId);
    if (chechFav.length>0){
      favorite=true
    }
    const resultElements = await Db.SelectOne(movieId);
    const szineszkapcsolo = await Db.SelectActors(movieId);
    const kategoriakapcsolo = await Db.SelectCategory(movieId);
    res.render("adatlap.ejs", {
      favorite: favorite,
      list: resultElements,
      szineszek: szineszkapcsolo,
      kategoria: kategoriakapcsolo,
      session: req.session,
    });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

module.exports = router;
