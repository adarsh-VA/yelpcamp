const express = require('express');
const router = express.Router({mergeParams:true});
const Wrap = require('../utilities/Wrap');
const review = require('../models/revm');
const cam = require('../models/campm');
const {isLoggedIn,validaterev,isAuthor} = require('../utilities/middlewares');


router.post('/review',isLoggedIn,validaterev,Wrap(async(req,res,next)=>{
    const {campid} = req.params;
    const r = new review(req.body);
    r.author = req.user._id;
    const c = await cam.findById(campid);
    c.reviews.push(r);
    await r.save();
    await c.save();
    req.flash('success','Review Created Successfully!!');
    res.redirect(`/campgrounds/each/${campid}`);
}))

router.delete('/review/:revid',isAuthor,Wrap (async(req,res)=>{
    let {campid,revid} = req.params;
    await cam.findByIdAndUpdate(campid,{ $pull : {reviews : revid}});
    await review.findByIdAndDelete(revid);
    res.redirect(`/campgrounds/each/${campid}`) 
}))

module.exports = router;