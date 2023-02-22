const mysql = require("mysql2");
const { password } = require("./dbconfig");
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
async function SelectFilmekIndex() {
    return new Promise((resolve, reject) => {
        pool.query('select filmek.* from  filmek '+
        'where Kezdolapon = true;', (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
}; 
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
    pool.query("SELECT * FROM egesz where FilmID=?", movieId, (error, elements) => {
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
async function UpdateUser(id,Username,Password,Neve,Email,Profilkep) {
  return new Promise((resolve, reject) => {
    sqlPw='';
    sqlImg='';
    par=[Username,Neve,Email]


    if (Password && Passsword.length>2){
        sqlPw=',password=titkosit(?)'
        par.push(Password)
    }
    if (Profilkep && Profilkep.length>0){
      sqlPw=',password=titkosit(?)'
      par.push(Password)
     }
     sqlWhere=' Where id=?';
     par.push(id);


     sql ='Update user set Username=?,Neve?,Email=?'+sqlPw +sqlImg+sqlWhere;

      pool.query(sql,par,(error,elements)=>{
        if(error){
          return reject(error);
        }
        return resolve(elements);
      })
    })
  };
  async function SearchFilm(MagyarCim,Rendezo,Ev,EredetiCim) {
    return new Promise((resolve, reject) => {
      sql="Select * from egesz where"
      par =[];
      if (MagyarCim){
        sql=sql+" MagyarCim=?"
        par.push(MagyarCim);
      }
      if (Rendezo){
        if (MagyarCim){sql=sql+" and "}
        sql=sql+" Rendezo=?"
        par.push(Rendezo);
      }
      if (Ev){
        if (MagyarCim || Rendezo){sql=sql+" and "}
        sql=sql+" Ev=?"
        par.push(Ev);
      }
      if (EredetiCim){
        if (MagyarCim || Rendezo || Ev){sql=sql+" and "}
        sql=sql+" EredetiCim=?"
        par.push(EredetiCim);
      }

        pool.query(sql,par,(error,elements)=>{
          if(error){
            return reject(error);
          }
          return resolve(elements);
        })
      })
    };
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
async function SelectOneUser(user_id) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT Username,Email,Profilkep,Neve,Date(Letrehozas) as Letrehozas FROM user where id=?", user_id, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}
//  külső név : belső név
module.exports = {
  SelectOneUser: SelectOneUser,
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
  SelectFilmekIndex: SelectFilmekIndex,
  UpdateUser:UpdateUser,
  SearchFilm:SearchFilm
};
