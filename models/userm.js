const { string } = require('joi');
const mon = require('mongoose');
const plm = require('passport-local-mongoose');

const userschema = new mon.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

userschema.plugin(plm);

module.exports = mon.model('users',userschema);