const mon = require('mongoose');
const Review = require('./revm');

// creating schema
const campschema= new mon.Schema({
    title:String,
    location:String,
    price:{
        type:Number,
        min:0
    },
    images:[
        {
            url:String,
            filename:String
        }
    ],
    description:String,
    author:{
        type: mon.Schema.Types.ObjectId,
        ref:'users'
    },
    reviews:[{
        type:mon.Schema.Types.ObjectId,
        ref:'reviews'
    }]

})

campschema.post('findOneAndDelete',async function(doc){
    await Review.deleteMany({
        _id:{
            $in:doc.reviews
        }
    })
})

module.exports= mon.model('campground',campschema);  