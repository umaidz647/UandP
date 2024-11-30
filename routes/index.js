var express = require('express');
var router = express.Router();
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
  } catch (error) {
      res.status(500).send('Error deleting the review');
  }
});



module.exports = router;
