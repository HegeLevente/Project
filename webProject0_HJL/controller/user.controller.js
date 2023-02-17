var Db = require('../db/dboperation');
exports.allusers = async (req,res)=>{
    try{
    pageNo = req.params.page-1;
    if(pageNo<1 || isNaN(pageNo)){ pageNo=0}

    const resultElements = await Db.SelectUser(pageNo);

    res.render('userlist',{list:resultElements})
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
  }
