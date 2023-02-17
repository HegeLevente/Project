const mysql = require("mysql2");
var config = require("./dbconfig");

const pool = mysql.createPool(config);

async function SelectFilm(pageNo) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * from filmek LIMIT 50 OFFSET ?",
      pageNo * 50,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}

//---------------------------------------------------------

async function SelectUser(pageNo) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id, Username, Neve, Email,Jogosultsag,Letrehozas FROM user LIMIT 50 offset ?",pageNo*50,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}
async function SelectFilmek(pageNo) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT filmek.* FROM filmek LIMIT 18 offset ?",
      pageNo * 18,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}
/*async function SelectFilmekIndex(pageNo) {
    return new Promise((resolve, reject) => {
        pool.query('select filmek.* from  filmek'+
        'where Kezdolapon = true;', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};*/
async function SelectKategoria() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM kategoria", (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}
async function SelectOne(movieId) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM egesz where ID=?", movieId, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}
async function SelectActors(movieId) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT sz.Szinesz AS szinesz
        from szinesz sz, szineszkapcsolo szk
        WHERE sz.id=szk.SzineszID and szk.Film_id=?`,
      movieId,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}
async function SelectCategory(movieId) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT k.KategNev AS kategoria
        from kategoria k, kategkapcsolo kk
        WHERE k.KategId=kk.KategID and kk.FilmID=?`,
      movieId,
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}

async function InsertUser(username, password, name, email) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO user (Username,Password,Neve,Email) VALUES (?,titkosit(?),?,?)",
      [username, password, name, email],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}
async function InsertFavorite(username, flimid) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO kedvenckapcsolas (userID, FilmID) VALUE (?,?)",
      [username, filmid],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}
async function DeleteFavorite(username, flimid) {
  return new Promise((resolve, reject) => {
    pool.query(
      "Delete kedvenckapcsolas from kedvenckapcsolas where FilmID=? and userID=?;",
      [user_id, filmid],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}

async function VerifyUser(username, password) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM filmek.user where Username=? and Password=titkosit(?)",
      [username, password],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}

//  külső név : belső név
module.exports = {
  SelectUser: SelectUser,
  SelectFilmek: SelectFilmek,
  SelectFilm: SelectFilm,
  DeleteFavorite: DeleteFavorite,
  InsertFavorite: InsertFavorite,
  SelectKategoria: SelectKategoria,
  InsertUser: InsertUser,
  VerifyUser: VerifyUser,
  SelectOne: SelectOne,
  SelectActors: SelectActors,
  SelectCategory: SelectCategory,
};
