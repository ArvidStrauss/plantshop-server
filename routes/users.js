const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/users.js");
const User = require("../models/user");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one user
router.get("/:id", getUser, async (req, res) => {
  res.json(res.user);
});

// Create one post
router.post("/", async (req, res) => {
  const post = new Post({
    author: req.body.author,
    content: req.body.content,
    img: req.body.img
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one post
router.patch("/:id", getPost, async (req, res) => {
  if (req.body.author != null) {
    res.post.author = req.body.author;
  }
  if (req.body.content != null) {
    res.post.content = req.body.content;
  }
  if (req.body.likedBy != null) {
    res.post.likedBy.push(req.body.likedBy);
  }
  if (req.body.replies != null) {
    res.post.replies.push(req.body.replies);
  }
  if (req.body.countOfHelpful != null) {
    res.post.countOfHelpful = req.body.countOfHelpful;
  }
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch {
    res.status(400).json({ message: err.message });
  }
});

// Delete one post
router.delete("/:id", getPost, async (req, res) => {
  try {
    await res.post.remove();
    res.json({ message: "Deleted this Post" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware Function before :id requests
async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Can't find post" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
