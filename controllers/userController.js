const userModel = require('../models/user');
const movieModel = require('../models/movies'); // Make sure to import Movie model if needed

// Get user profile
const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId)
    //   .select('-password -__v'); // Exclude sensitive/unecessary fields
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's favorite movies
const getFavMovies = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId)
      .populate({
        path: 'favorites',
        model: 'movies', // This must match your model name
        select: 'title year genre rating image'
      });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, 
      favorites: user.favorites });
  } catch (err) {
    console.error('Error getting favorite movies:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add movie to favorites
const addToFav = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    if (!userId || !movieId) {
      return res.status(400).json({ success: false, message: 'User ID and Movie ID are required' });
    }
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if movie exists (optional but recommended)
    const movieExists = await movieModel.exists({ _id: movieId });
    if (!movieExists) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check if already in favorites
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Movie already in favorites' 
      });
    }

    user.favorites.push(movieId);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Movie added to favorites', 
      favorites: user.favorites 
    });
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove movie from favorites
const deleteFav = async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const initialCount = user.favorites.length;
    user.favorites = user.favorites.filter(
      favId => favId.toString() !== movieId
    );

    // Check if anything was actually removed
    if (user.favorites.length === initialCount) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found in favorites' 
      });
    }

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Movie removed from favorites', 
      favorites: user.favorites 
    });
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getUser,
  getFavMovies,
  addToFav,
  deleteFav
};