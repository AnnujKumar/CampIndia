const express = require("express");
const passport = require("passport");
const router = express.Router({mergeParams:true});
const User = require("../models/user");
router.get("/register",(req,res)=>{
    res.render("users/register");
})
router.post("/register",async(req,res,next)=>{
    try{
    const {username,email,password} = req.body;
    const user = new User({username:username,email:email});
    const newUser = await User.register(user,password);
    req.login(newUser,function(err){
        if(err){
            next(err);
        }
        req.flash("success","You have successfully registered");
       return  res.redirect("/campgrounds");
    })
  
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/register");
    }
})
router.get("/login",(req,res)=>{
    res.render("users/login");
})
const storeTo = (req,res,next)=>{
    if(req.session.returnTo){
    res.locals.returnTo = req.session.returnTo;
}
next();

}
router.post("/login",storeTo,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
    req.flash("success","Welcome back");
    if(res.locals.returnTo){
    return res.redirect(`${res.locals.returnTo}`);
}
else {
    res.redirect("/campgrounds");
}
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});
module.exports = router;