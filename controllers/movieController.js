const movieModel = require('../models/movies');


// Function to add a new movie
const addMovie = async (req, res) => {
    try {

        if (!req.file || !req.file.path) {
            return res.status(400).json({
                status: "error",
                message: "Movie image is required" });
        }
        const { title, description, releaseDate, genre, rating } = req.body;
        const image = req.file.path;

        const newMovie = new movieModel({
            title,
            description,
            image,
            releaseDate,
            genre,
            rating
        });

        await newMovie.save();
        res.status(201).json({ message: "Movie added successfully", movie: newMovie });
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
}
// Function to get all movies
const getAllMovies = async (req, res) => {
    try {
        const movies = await movieModel.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Function to get a movie by ID
const getMovieById = async (req, res) => {
    try {
        const movie = await movieModel.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteMovie = async (req, res) => {
    try {
        const movie = await movieModel.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const searchMovies = async (req, res) => {
    const { title } = req.query;
    try {
        if (!title) {
            return res.status(400).json({ message: "Title query parameter is required" });
        }
        const movies = await movieModel.find({ title: new RegExp(title, 'i') });
        if (movies.length === 0) {
            return res.status(404).json({ message: "No movies found" });
        }
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
  
// Exporting the functions
module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    deleteMovie,
    searchMovies
};