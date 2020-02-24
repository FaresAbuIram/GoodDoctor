var express = require('express')
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

var router = express();
router.get('/login', forwardAuthenticated, (req, res) => { res.render('login', { title: 'Login Page' }) })
router.get('/register', forwardAuthenticated, (req, res) => { res.render('register', { title: 'Register Page' }) })


router.post('/register', (req, res) => {
  const { name, password, password2 } = req.body;
  const type = 'admin';
  let errors = [];

  if (!name || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });

  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });

  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });

  }
  let errorMasseges = ''
  errors.forEach(element => {
    errorMasseges = errorMasseges+"\v"+ element.msg;
  });

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      type,
      password,
      password2,
      message: errorMasseges

    });
  } else {
    User.findOne({ name: name }).then(user => {
      if (user) {
        errors.push({ msg: 'user already exists' });
        let errorMasseges = ''
        errors.forEach(element => {
          errorMasseges = errorMasseges+"\v"+ element.msg;
        });
        res.render('register', {
          errors,
          name,
          password,
          password2,
          message: errorMasseges
        });
      } else {
        const newUser = new User({
          name,
          type,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


module.exports = router;    