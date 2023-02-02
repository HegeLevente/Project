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
        pool.query('SELECT filmek.*,kategoria.kategoria FROM filmek '+
        'INNER JOIN kategoria ON filmek.KategoriaID = kategoria.kategoriaid LIMIT 18 offset ?',pageNo*18 , (error, elements) => {
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
  SelectKategoria : SelectKategoria,
  SelectKepekFiltered : SelectKepekFiltered,
  InsertUser: InsertUser,
  VerifyUser: VerifyUser,
}