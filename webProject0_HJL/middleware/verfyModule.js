checkLogged = (req,res, next)=>{
    if(req.session.user_id){
        next()
        return;
    }else{
        res.redirect('/user/login')
    }
}

checkAdmin = (req,res,next)=>
{
    if (req.session.jogosultsag==3){
        next();
        return;
    }
    else{res.send("Ehhez nincs jogosulsága!")}
}

module.exports={
    checkLogged:checkLogged,
    checkAdmin:checkAdmin
}