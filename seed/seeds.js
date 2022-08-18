const mon = require('mongoose');
const campsh = require("../models/campm");
const {des,place}= require('./names');
const con = require('./cities');
require('dotenv').config();

// mongo db connection 'mongodb://localhost:27017/camp'
const db=process.env.DB; //mongodb://localhost:27017/camp
mon.connect(db)
.then(()=>{
    console.log("connection open!!");
})
.catch((err)=>{
    console.log("Error in connecting!");
    console.log(err);
})

const sample = array => array[Math.floor(Math.random()*array.length)]; 

const seedDB = async()=>{
    await campsh.deleteMany({});
    let t='',l='',p=0,r=0,im='',a='';
    for(let i=0;i<50;i++){
        r=Math.floor(Math.random()*con.length);
        t=`${sample(des)} ${sample(place)}`;
        l=`${con[r].city}, ${con[r].state}`;
        p=Math.floor(Math.random()*20)+10;
        im= [{
            url:`https://source.unsplash.com/600x400/?${con[r].city}`,
            filename:''
        }];
        a='62fcef202d439bab22037d01';
        campsh.insertMany({title:t,location:l,price:p,images:im,description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea a, culpa consequuntur, sit nobis unde fugit magnam saepe laudantium possimus voluptatibus ratione sapiente numquam nostrum in laboriosam pariatur dignissimos. Eos!",author:a}); 
    }

}
seedDB();