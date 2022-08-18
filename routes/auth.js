const express = require('express');
const { isValidObjectId } = require('mongoose');
const passport = require('passport');
const router = express.Router();
const user = require('../models/userm');
const {checkReturn,isLoggedIn} = require('../utilities/middlewares');

router.get('/login',(req,res)=>{
    if(req.query.R){
        
        req.session.rt=req.query.R;
    }
    res.render('login',{tl:"Login"});
})

router.get('/register',(req,res)=>{
    res.render('register',{tl:"Login"});
})

// passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),
router.post('/login',checkReturn,passport.authenticate('local',{failureFlash: true,failureRedirect:'/login'}),(req,res)=>{
    const urll = res.locals.return || '/campgrounds';
    req.flash('success','Logged in!');
    // console.log('log:',res.locals.return);
    // console.log(req.user._id);
    res.redirect(urll);
})

router.post('/register',async(req,res,next)=>{
    try{
        const {email,username,password} = req.body;
        const u = new user({email,username});
        const nu= await user.register(u,password);
        req.login(nu,err=>{
            if(err){return next(err);}
            req.flash('success','successfully logged in!');
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
})

router.get('/logout',isLoggedIn,(req,res,next)=>{
    req.logout((err)=>{
        if(err){return next(err);}
        req.flash('success','See You Again, Bye!');
        res.redirect('/');
    });
});
module.exports = router;