const joi = require('joi');
const AE = require('../utilities/EC');
const review = require('../models/revm');
const Joi = require('joi');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must Login first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    let {revid,id} = req.params;
    const r=await review.findById(revid);
    if(req.user.id != r.author){
        req.flash('error','access denied!');
        return res.redirect(`/campgrounds/each/${id}/review/${revid}`);
    }
    next();
}

module.exports.checkReturn=(req,res,next)=>{
    if(req.session.rt){
        res.locals.return=req.session.rt;
    }
    next();
}

module.exports.validatecamp = (req,res,next)=>{
    const campsc = joi.object({
        camp:joi.object({
            title:joi.string().required(),
            location: joi.string().required(),
            // image: joi.string().required(),
            price: joi.number().required().min(0),
            description: joi.string().required()
        }).required(),
        deleteImages:Joi.array()
    })
    const {error} = campsc.validate(req.body);
    if (error){
        console.log(error);
        throw new AE(error,400);
    }
    else{
        next();
    }
}

module.exports.validaterev = (req,res,next)=>{
    const revs = joi.object({
        review:joi.string().required(),
        rating:joi.number().required().min(0).max(5)
    }).required()
    const {error} = revs.validate(req.body);
    if (error){
        console.log(error);
        throw new AE(error,400);
    }
    else{
        next();
    }
}