const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
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

router.post('/authenticate', async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ data: user }, config.secretKey, {
        expiresIn: 604800
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
      return res.json({ success: false, msg: 'Wrong password' });
    }
  } catch (error) {
    throw error;
  }
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user });
});

module.exports = router;
