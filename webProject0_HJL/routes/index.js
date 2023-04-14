const { constants } = require("buffer");
var express = require("express");
var router = express.Router();
var path = require("path"); // útvonalhoz

var Db = require("../db/dboperation");
var verify = require("../middleware/verfyModule");
/* GET home page. */
 const prevpage =""
router.get("/", async (req, res, next) => {
  const resultElements = await Db.SelectFilmekIndex();
  const imdb = await Db.SelectFilmekIMDB();
  res.render("index.ejs", { list: resultElements, session: req.session, imdb:imdb });
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
router.get("/szinesz/:nev", async (req, res, next) => {
  try {
    szineszNeve = req.params.nev.replace("+"," ");
    const resultElements = await Db.SelectSzineszFilm(szineszNeve);
    res.render("actor.ejs", { list: resultElements,szinesz:szineszNeve, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/rendezo/:nev", async (req, res, next) => {
  try {
    rendezoNeve = req.params.nev.replace("+"," ");
    const resultElements = await Db.SelectRendezoFilm(rendezoNeve);
    res.render("rendezo.ejs", { list: resultElements,rendezo:rendezoNeve, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/kategoria/:nev", async (req, res, next) => {
  try {
    kategoriaNeve = req.params.nev;
    const resultElements = await Db.SelectKategoriaFilm(kategoriaNeve);
    res.render("kategoria.ejs", { list: resultElements,kategoria:kategoriaNeve, session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/szures", async (req, res, next) => {
  try {
    res.render("szures.ejs", { session: req.session });
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});
router.get("/getActor/:nev", async (req, res, next) => {
  try {
    nev = req.params.nev;
    const actor = await Db.SelectSzinesz(nev);
    res.render("actorlist.ejs", { list:actor});
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(e.sendStatus);
  }
});
router.get("/getCategory/:nev", async (req, res, next) => {
  try {
    kategoria = req.params.nev;
    const category = await Db.SelectKategoria(kategoria);
    res.render("categorylist.ejs", { list:category});
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(e.sendStatus);
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
      console.log(req.body.filmId)
      await Db.InsertFavorite(req.session.user_id, req.body.filmId);
      res.redirect(req.session.previousURL)
    } else {
      req.session.previousURL = ("/film/" + req.body.filmID)
      res.redirect("/user/login");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.post("/removeFavorite", async (req, res, next) => {
  try {
    if (req.session.user_id) {
      await Db.DeleteFavorite(req.session.user_id, req.body.filmId);
      favorite="";
      res.redirect("/film/"+req.body.filmId)
    } else {
      req.session.previousURL = ("/film/"+req.body.filmId);
      res.redirect("/user/login");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.get("/film/:id", async (req, res, next) => {
  try {
    req.session.previousURL="/film/"+req.params.id;
    const movieId = req.params.id;
    favorite=false;
    const checkfavourite = await Db.SelectFavorite(req.session.user_id, movieId);
    const resultElements = await Db.SelectOne(movieId);
    const szineszkapcsolo = await Db.SelectActors(movieId);
    const kategoriakapcsolo = await Db.SelectCategory(movieId);
    if (checkfavourite.length>0)
    {
      favorite=true;
    }
    res.render("adatlap.ejs", {
      favorite: favorite,
      list: resultElements,
      szineszek: szineszkapcsolo,
      kategoria: kategoriakapcsolo,
      session: req.session,
      
    });
    console.log(favorite);
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

module.exports = router;
