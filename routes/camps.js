const express = require('express');
const router = express.Router();
const Wrap = require('../utilities/Wrap');
// const { string, number } = require("joi");
const review = require('../models/revm');
const cam = require('../models/campm');
const {isLoggedIn,validatecamp} = require('../utilities/middlewares');
const multer = require('multer');
const {storage, cloudinary} = require('../cloudinary/c');
// const upload = multer({dest:'uploads/'});
const upload = multer({storage});

router.get('/',isLoggedIn,async(req,res)=>{
    const cms=await cam.find({});
    res.render('campgrounds',{cms,tl:"All Campgrounds"});
})

router.get('/new',isLoggedIn,(req,res)=>{
    // let id = req.params.id;
    // const cms=await cam.findById(id);
    res.render('new',{tl:"Add Campground"});
})

router.get('/edit/:id',isLoggedIn,Wrap(async(req,res)=>{
    let id = req.params.id;
    const cms=await cam.findById(id);
    if(req.user.id != cms.author){
        req.flash('error','access denied!');
        return res.redirect(`/campgrounds/each/${id}`);
    }
    res.render('edit',{cms,tl:cms.title});
}))

router.get('/each/:id',Wrap(async(req,res)=>{
    let id = req.params.id;
    const cms=await cam.findById(id).populate({path:"reviews",populate:{path:'author'}}).populate('author');
    if (!cms){
        req.flash('error','Campground not found!');
        res.redirect('/campgrounds')
    }
    res.render('each',{cms,tl:cms.title});
}))

router.patch('/update/:id',isLoggedIn,upload.array('image'),validatecamp,Wrap(async(req,res)=>{
    let id = req.params.id;
    console.log(req.body);
    let c = await cam.findByIdAndUpdate(id,req.body.camp);
    let im = req.files.map(f=>({url:f.path, filename:f.filename}));
    c.images.push(...im);
    c.save();
    if(req.body.deleteImages){
        for(let fname of req.body.deleteImages){
            await cloudinary.uploader.destroy(fname);
        }
        await c.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}});
        console.log(c);
    }
    
    req.flash('success','successfully updated campground!');
    res.redirect(`/campgrounds/each/${id}`)
}))

// const f1 = ()=>{
//     console.log(id1===id2);
//     console.log("fucntion has called");
// }

router.post('/create',isLoggedIn,upload.array('image'),Wrap(async(req,res,next)=>{
    // if(!req.body.camp) throw new AE("Invalid Campground Data",400);
    const c= new cam(req.body.camp);
    c.author = req.user.id;
    c.images = req.files.map(f=>({url:f.path, filename:f.filename}));
    await c.save();
    console.log(c);
    req.flash('success','successfully created campground!');
    res.redirect('/campgrounds');
}))
// router.post('/create',isLoggedIn,upload.single('camp[image]'),(req,res,next)=>{
//     console.log(req.file,req.body.camp);
//     res.redirect('/campgrounds');
// });

router.delete('/:id',isLoggedIn,Wrap(async(req,res)=>{
    let id = req.params.id;
    await cam.findByIdAndDelete(id);
    req.flash('success','successfully Deleted campground!');
    res.redirect('/campgrounds')
}))


module.exports = router;