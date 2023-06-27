// const express = require('express')
// const router = express.Router();

// const User = require('../models/users');


// router.post('/register',(req,res,next)=>{
//    let newUser =new User ({
//     name: req.body.name,
//     email: req.body.email,
//     username: req.body.username,
//     password: req.body.password
//    });
//    User.addUser(newUser, (err,user) => {
//       if(err){
//         res.json({success: false, msg: 'failed to register '});

//       } else {
//         res.json({ success: true, msg: 'registered'});
//       }
//    }
//    ) 
// });

// router.post('/authenticate',(req,res,next)=>{
//     res.send('aunthenticate');
// });

// router.get('/profile',(req,res,next)=>{
//     res.send('profile');
// });


// module.exports=router

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config= require('../config/database');
const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.post('/register', async (req, res, next) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    const user = await User.addUser(newUser);
    res.json({ success: true, msg: 'Registered', user });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Failed to register', error });
  }
});

router.post('/authenticate', async(req, res, ) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username,(err,user)=>{
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'user not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch)=>{
        if(err) throw err;
        if(isMatch){
          const token = jwt.sign(user, config.secretKey, {
            expiresIn : 604800
          });
          res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email
            }
          });
        } else {
          return res.json({success: false, msg: 'wrong password'});

        }
    });
  });
});

router.get('/profile',passport.authenticate('jwt',{session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
