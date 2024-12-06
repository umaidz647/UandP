var express = require('express');
var router = express.Router();
const Review = require('../models/review');
let userModel = require('../models/user')
let User = userModel.User;
let passport = require('passport');
let jwt = require('jsonwebtoken');
let DB = require('../config/db');
// Home route: Display all reviews
router.get('/', async (req, res) => {
  try {
      const reviews = await Review.find();
      res.render('index', { reviews });
  } catch (error) {
      res.status(500).send('Error fetching reviews');
  }
});

// Add new review route
router.get('/add', (req, res) => {
  res.render('add');
});

router.post('/add', async (req, res) => {
  const { movieName, releaseDate, reviewText } = req.body;
  const newReview = new Review({
      movieName,
      releaseDate,
      reviewText,
  });
  
  try {
      await newReview.save();
      res.redirect('/');
  } catch (error) {
      res.status(500).send('Error saving the review');
  }
});

// Edit review route
router.get('/edit/:id', async (req, res) => {
  try {
      const review = await Review.findById(req.params.id);
      res.render('edit', { review });
  } catch (error) {
      res.status(500).send('Error fetching the review');
  }
});

router.post('/edit/:id', async (req, res) => {
  const { movieName, releaseDate, reviewText } = req.body;
  try {
      await Review.findByIdAndUpdate(req.params.id, {
          movieName,
          releaseDate,
          reviewText,
      });
      res.redirect('/');
  } catch (error) {
      res.status(500).send('Error updating the review');
  }
});

// Delete review route
router.get('/delete/:id', async (req, res) => {
  try {
      await Review.findByIdAndDelete(req.params.id);
      res.redirect('/');
      username: req.user ? req.user.username: ''
  } catch (error) {
      res.status(500).send('Error deleting the review');
  }
});

router.get('/login', async (req, res) => {
  if (!req.user)
  {
    res.render('login',
    {
      title: 'login',
      message: req.flash('loginMessage')

    })
  }
  else
  {
    return res.redirect('/')
  }
});

router.post('/login', async (req, res , next) => {
  passport.authenticate('local',(err,user, info)=>
    {
        // server error
        if(err)
        {
            return next(err);
        }
        // is a login error
        if(!user)
        {
            req.flash('loginMessage',
            'AuthenticationError');
            return res.redirect('/login');
        }
        req.login(user,(err) => {
            if(err)
            {
                return next(err)
            }
            const payload = 
            {
                username: user.username,
            }

            const authToken = jwt.sign(payload, DB.secret, {
                expiresIn: 604800 // 1 week
            });
            return res.redirect('/');
        });
    })(req,res, next)
});

router.get('/register', async (req, res) => {
  // check if the user is not already logged in 
  if(!req.user)
    {
        res.render('register',
            {
                title: 'Register',
                message: req.flash('registerMessage'),
                username: req.user ? req.user.username: ''
            })
    }
    else
    {
        return res.redirect('/')
    }
});

router.post('/register', async (req, res) => {
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password,
})
User.register(newUser, req.body.password, (err) =>{
    if(err)
    {
        console.log("Error: Inserting the new user");
        if(err.name=="UserExistsError")
            {
                req.flash('registerMessage',
                'Registration Error: User Already Exists');
            }
        return res.render('register',
        {
            title:'Register',
            message: req.flash('registerMessage'),
            username: req.user ? req.user.username: ''
        });
    }
    else
    {
    //    res.json({success:true, msg:'User registered Successfully'});
        // if registration is successful
        return passport.authenticate('local')(req,res,()=>{
            res.redirect('/');
        })    
    }
})
});

router.post('/logout', async (req, res) => {
  req.logout(function(err){
    if(err){
        return next(err);
    }
})
res.redirect('/');
});

module.exports = router;
