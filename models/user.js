const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    required: true
  },
  registered: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
