const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    // unique: [true, "Email already exist"]
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken:{
    type: String
  },
  verificationExp:{
    type: String
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel