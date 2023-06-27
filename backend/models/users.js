// const mongoose = require('mongoose');
// const bcrypt = require ('bcryptjs');
// const config= require('../config/database')

// const UserSchema = mongoose.Schema({
//     name: {
//         type : String, 
//         required : true
//     },

//     email:{
//         type : String,
//         required : true
// },

//     username: {
//         type : String, 
//         required : true
//     },
//     password:{
//         type :String , 
//         select : false 
//     }

// });

// const User = module.exports= mongoose.model('User',UserSchema);


// module.exports.getUserById = function(id, callback){
//     User.findById(id,callback);
// }
// module.exports.getUserByUsername = function(username, callback){
//     const  query= {username: username}
//     User.findOne(query,callback);
// }



// module.exports.addUser = function(newUser, callback){
//     bcrypt.genSalt(10, (err, salt )=>{
//         bcrypt.hash(newUser.password,salt,(err,hash)=>{
//             newUser.password=hash;
//             newUser.save(callback);
//         });
//     });
// }


const config= require('../config/database')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    select: false
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.getUserById = function(id) {
  return User.findById(id);
};

module.exports.getUserByUsername = function(username) {
  return User.findOne({ username });
};

module.exports.addUser = async function(newUser) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    return newUser.save();
  } catch (error) {
    throw error;
  }
};

// module.exports.comparePassword = async function(candidatePassword, hash, callback){
//     bcrypt.compare(candidatePassword ,hash , (err, isMatch) => {
//        if(err) throw err;
//        callback(null, isMatch);
//     });
module.exports.comparePassword = async function(candidatePassword, hash) {
  try {
    return await bcrypt.compare(candidatePassword, hash);
  } catch (error) {
    throw error;
  }
};

