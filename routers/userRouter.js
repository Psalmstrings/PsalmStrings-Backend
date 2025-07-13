const express = require('express');
const userRouter = express.Router();
const userModel = require('../models/user');
const movieModel = require('../models/movies');
const { getUser, getFavMovies, addToFav, deleteFav} = require('../controllers/userController');

// Get user profile
userRouter.get('/:userId', getUser);
userRouter.get('/:userId/favorites', getFavMovies);
userRouter.post('/:userId/favorites/:movieId', addToFav);
userRouter.delete('/:userId/favorites/:movieId', deleteFav);


module.exports = userRouter;