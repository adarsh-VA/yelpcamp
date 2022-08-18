const mon = require('mongoose');

// creating schema
const revschema= new mon.Schema({
    review:String,
    rating:{
        type:Number,
        min:0
    },
    author:{
        type: mon.Schema.Types.ObjectId,
        ref:'users'
    }
})
module.exports= mon.model('reviews',revschema); 