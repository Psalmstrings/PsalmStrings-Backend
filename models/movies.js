const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    image: {
        type: String,
    },
    releaseDate: {
        type: Date,
        required: [true, "Release date is required"],
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 0,
        max: 10
    }
})

const movieModel = mongoose.model("movies", movieSchema);
module.exports = movieModel;
