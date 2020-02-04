const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one post
router.get("/:id", getPost, async (req, res) => {
  res.json(res.post);
});

// Create one post
router.post("/", async (req, res) => {
  const post = new Post({
    author: req.body.author,
    content: req.body.content
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
    res.post.likedBy = req.body.likedBy;
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
async function getPost(req, res, next) {
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Can't find post" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}

module.exports = router;
