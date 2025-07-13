const express = require('express');
const movieRouter = express.Router();
const movieModel = require('../models/movies');
const uploadMovieImage = require('../config/multer');
const { addMovie, getAllMovies, getMovieById, deleteMovie, searchMovies } = require('../controllers/movieController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAnAdmin');


movieRouter.post('/',  uploadMovieImage.single("movieImage"), addMovie);
movieRouter.get('/', getAllMovies);
movieRouter.get('/:id', getMovieById);
movieRouter.delete('/:id', deleteMovie);
movieRouter.get('/', searchMovies);

module.exports = movieRouter;