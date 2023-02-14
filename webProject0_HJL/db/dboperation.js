const mysql = require("mysql2");
var config = require('./dbconfig');

const pool = mysql.createPool(config);

async function SelectFilm(pageNo) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * from filmek LIMIT 50 OFFSET ?',pageNo*50 , (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

//---------------------------------------------------------

async function SelectFilmek(pageNo) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT filmek.* FROM filmek LIMIT 18 offset ?',pageNo*18 , (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};


async function SelectKepek() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT kepek.*,kategoria.nev FROM kepek '+
           'INNER JOIN kategoria ON kepek.kateg_id = kategoria.id', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectKepekFiltered(kateg_id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT kepek.*,kategoria.nev FROM kepek '+
           'INNER JOIN kategoria ON kepek.kateg_id = kategoria.id where kepek.kateg_id=?',[kateg_id], (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function InsertKep(kepnev,kateg_id,user_id,megnev) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO KEPEK (kepnev,kateg_id,user_id,megnev) VALUES (?,?,?,?)',[kepnev,kateg_id,user_id,megnev], (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

async function SelectKategoria() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM kategoria', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
async function SelectOne(movieId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM egesz where ID=?', movieId,(error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
async function SelectActors(movieId) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT sz.Szinesz AS szinesz
        from szinesz sz, szineszkapcsolo szk
        WHERE sz.id=szk.SzineszID and szk.Film_id=?`, movieId,(error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
async function SelectCategory(movieId) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT k.KategNev AS kategoria
        from kategoria k, kategkapcsolo kk
        WHERE k.KategId=kk.KategID and kk.FilmID=?`, movieId,(error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
async function InsertUser(username,password,name,email) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user (Username,Password,Neve,Email) VALUES (?,titkosit(?),?,?)',
        [username,password,name,email], (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
async function InsertFavorite(username,flimid){
    return new Promise((resolve,reject)=>{
        pool.query("INSERT INTO kedvenckapcsolas (userID, FilmID) VALUE (?,?)",
        [username,filmid],(error,elements)=>{
            if (error){
                return reject (error);
            }
            return resolve(elements);
        });
    });
};
async function DeleteFavorite(username,flimid){
    return new Promise((resolve,reject)=>{
        pool.query("Delete kedvenckapcsolas from kedvenckapcsolas where FilmID=? and userID=?;",
        [user_id,filmid],(error,elements)=>{
            if (error){
                return reject (error);
            }
            return resolve(elements);
        });
    });
};

async function VerifyUser(username,password) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM filmek.user where Username=? and Password=titkosit(?)',
        [username,password], (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

//  külső név : belső név
module.exports = {
    SelectFilmek: SelectFilmek,
  SelectFilm :SelectFilm,
  SelectKepek : SelectKepek,
  InsertKep : InsertKep,
  DeleteFavorite : DeleteFavorite,
  InsertFavorite : InsertFavorite,
  SelectKategoria : SelectKategoria,
  SelectKepekFiltered : SelectKepekFiltered,
  InsertUser: InsertUser,
  VerifyUser: VerifyUser,
  SelectOne:SelectOne,
  SelectActors:SelectActors,
  SelectCategory:SelectCategory
}