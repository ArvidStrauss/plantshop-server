const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  replies: {
    type: Array,
    required: false
  },
  likedBy: {
    type: Array,
    required: false
  },
  countOfHelpful: {
    type: Number,
    required: true,
    default: 0
  },
  img: {
    type: String,
    required: true
  },
  contentImage: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Post", postSchema);
