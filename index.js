// if(process.env.NODE_ENV !=='production'){
//     require('dotenv').config();
// }

const express = require("express");
const ejs_mate=require('ejs-mate');
const mon = require('mongoose');
const app = express();
const cam = require('./models/campm');
const mtov = require('method-override');
const camps = require('./routes/camps');
const AE = require('./utilities/EC');
const revs = require('./routes/revs');
const session= require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const plocal = require('passport-local');
const user = require('./models/userm');
const auth = require('./routes/auth');
const MongoStore = require('connect-mongo')(session);
const port = process.env.PORT || 4000;

// middlewares
app.set('view engine','ejs');
app.engine("ejs",ejs_mate);
app.use(mtov('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


// mongo db connection
const db=process.env.DB; //mongodb://localhost:27017/camp
mon.connect(db)
.then(()=>{
    console.log("connection open!!");
})

.catch((err)=>{
    console.log("Error in connecting!");
    console.log(err);
})

const store = new MongoStore({
    url:db,
    secret: 'thisismysecret!',
    touchAfter: 24*60*60
})

// Sessions
const sconfig={
    store,
    secret:'thisismysecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sconfig));
app.use(flash());


// passport handler
app.use(passport.initialize());
app.use(passport.session());
passport.use(new plocal(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


// locals handler
app.use((req,res,next)=>{
    // console.log('locals:',req.session.returnTo);
    
    if(req.query.R){
        req.flash('error','You must Login first!');
    }
    res.locals.session = req.session
    res.locals.cuser = req.user;
    res.locals.message = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// test
app.get('/',async(req,res)=>{
    res.render('home',{tl:'Home'});
})

// Auth routes
app.use('/',auth);

// camps routes
app.use('/campgrounds',camps);

// reviews routes
app.use('/campgrounds/:campid',revs);

// invalid url handler
app.all('*',(req,res,next)=>{
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    next(new AE("No Such Page in the Server",404));
})

// error message handler
app.use((err,req,res,next)=>{
    const {message="something went wrong",statusCode=500}=err;
    console.log(err);
    res.status(statusCode).render('err',{err,tl:"Error"});
    // res.status(statusCode).send(message);
})

app.listen(port,(err)=>{
    console.log("server started");
})