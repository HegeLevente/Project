const mysql = require("mysql2");
const { password } = require("./dbconfig");
var config = require("./dbconfig");

const pool = mysql.createPool(config);

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
/*Szures*/
async function SelectKategoria() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT k.KategNev AS kategoria from kategoria k', (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}
async function SelectSzinesz() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT sz.Szinesz AS szinesz from szinesz sz', (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}
async function SearchFilm(MagyarCim,Rendezo,Ev,EredetiCim,Kategoria,Szinesz) {
  return new Promise((resolve, reject) => {
    sql="Select * from egesz where"
    par =[];
    if (MagyarCim){
      sql=sql+" MagyarCim LIKE ?"
      MagyarCim = "%"+MagyarCim+"%";
      par.push(MagyarCim);
    }
    if (Kategoria){
      if (MagyarCim){sql=sql+" and "}
      sql=sql+" Kategoria LIKE ?"
      Kategoria = "%"+Kategoria+"%";
      par.push(Kategoria);
    }
    if (Szinesz){
      if (MagyarCim || Kategoria){sql=sql+" and "}
      sql=sql+" Szinesz LIKE ?"
      Szinesz = "%"+Szinesz+"%";
      par.push(Szinesz);
    }
    if (Rendezo){
      if (MagyarCim || Szinesz || Kategoria){sql=sql+" and "}
      sql=sql+" Rendezo LIKE ?";
      Rendezo = "%"+Rendezo+"%";
      par.push(Rendezo);
    }
    if (Ev){
      if (MagyarCim|| Szinesz || Kategoria || Rendezo){sql=sql+" and "}
      sql=sql+" Ev=?"
      par.push(Ev);
    }
    if (EredetiCim){
      if (MagyarCim|| Szinesz || Kategoria || Rendezo || Ev){sql=sql+" and "}
      sql=sql+" EredetiCim LIKE ?";
      EredetiCim = "%"+EredetiCim+"%";
      par.push(EredetiCim);
    }
      pool.query(sql,par,(error,elements)=>{
        console.log(sql)
        console.log(par)
        if(error){
          return reject(error);
        }
        return resolve(elements);
      })
    })
};
async function SearchFilmAll(Kereses) {
  return new Promise((resolve, reject) => {
    console.log(Kereses)
    sql="Select * from egesz where MagyarCim like ? or EredetiCim like ? or Szinesz like ? or Kategoria like ? or Attekinto like ? or Rendezo like ? or hossz like ? or Ev like ? "
    par=["%"+Kereses+"%","%"+Kereses+"%","%"+Kereses+"%","%"+Kereses+"%","%"+Kereses+"%","%"+Kereses+"%","%"+Kereses+"%","%"+Kereses+"%",]
      pool.query(sql,par,(error,elements)=>{
        console.log(sql)
        if(error){
          return reject(error);
        }
        return resolve(elements);
      })
    })
};
/*------*/
/*Adatlap*/ 
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
      `SELECT sz.Szinesz AS szinesz from szinesz sz, szineszkapcsolo szk  WHERE sz.id=szk.SzineszID and szk.Film_id=?`,
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
/*------*/
async function SelectFavorite(user_id, filmId) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM kedvenckapcsolas where userID=? and FilmID", [user_id,filmId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}
async function InsertFavorite( user_id, sfilmId) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO kedvenckapcsolas (userID, FilmID) VALUE (?,?)",
      [user_id, filmId],
      (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      }
    );
  });
}
async function DeleteFavorite(user_id, filmId) {
  return new Promise((resolve, reject) => {
    pool.query(
      "Delete * from kedvenckapcsolas where FilmID=? and userID=?;",
      [user_id, filmId],
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
  SearchFilm:SearchFilm,
  SelectSzinesz:SelectSzinesz,
  SearchFilmAll:SearchFilmAll,
  SelectFavorite:SelectFavorite,
};
