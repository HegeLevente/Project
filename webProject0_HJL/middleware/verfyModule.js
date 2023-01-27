checkLogged = (req,res, next)=>{
    if(req.session.user_id){
        next()
        return;
    }else{
        res.redirect('/user/login')
    }
}