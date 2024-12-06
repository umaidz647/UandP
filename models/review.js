const mongoose = require('mongoose');

// Movie review schema
const reviewSchema = new mongoose.Schema({
    movieName: String,
    releaseDate: Date,
    reviewText: String,
  });
  
  // Movie review model
    const Review = mongoose.model('Review', reviewSchema);

    module.exports = Review;