const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type : String, required  : true},
  username : {type : String, required : true, unique : true},
  email : {type : String, required : true, unique : true},
  password : {type : String, required : true},
  userType : {
    type : String, 
    enum : ['admin', 'user'],
    default : 'user',
  }
},
{timestamps : true});


module.exports = mongoose.model('user', userSchema);
