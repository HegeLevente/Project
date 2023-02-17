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
    if (req.session.Jogosultsag==3){
        next();
        return;
    }
    else{res.render("message", {msg:'Ehhez nincs jogosultsága!',code:403})}
}

module.exports={
    checkLogged:checkLogged,
    checkAdmin:checkAdmin
}