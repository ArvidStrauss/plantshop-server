const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Create one user
router.post(
  "/sign-up",
  validateRegister,
  checkUsernameIsTaken,
  async (req, res) => {
    const lastLogin = Date.now();
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).send({
          message: err.message
        });
      } else {
        const user = new User({
          username: req.body.username,
          password: hash,
          lastLogin: lastLogin
        });

        try {
          const newUser = await user.save();
          res.status(201).json(newUser);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      }
    });
  }
);

//Login
router.post("/login", checkUsernameExists, async (req, res) => {
  bcrypt.compare(req.body.password, res.user.password, async (err, result) => {
    if (result) {
      const token = jwt.sign(
        {
          username: res.user.username,
          userId: res.user._id
        },
        "SECRETKEY",
        {
          expiresIn: "7d"
        }
      );

      res.user.lastLogin = Date.now();
      try {
        const updatedUser = await res.user.save();
        return res.status(200).send({
          message: "Logged in successfully!",
          token,
          user: updatedUser
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    } else {
      return res.status(401).send({
        message: "Username or password is incorrect!"
      });
    }
  });
});

// Middleware to validate user data
function validateRegister(req, res, next) {
  if (!req.body.username || req.body.username.length < 3) {
    return res.status(400).send({
      message: "Please enter a username with min. 3 chars"
    });
  }

  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).send({
      message: "Please enter a password with min. 6 chars"
    });
  }

  if (
    !req.body.password_repeat ||
    req.body.password != req.body.password_repeat
  ) {
    return res.status(400).send({
      message: "Both passwords must match"
    });
  }
  next();
}

//Middleware to check if Username is already taken for Sign-Up
async function checkUsernameIsTaken(req, res, next) {
  try {
    user = await User.findOne({
      username: req.body.username
    }).exec();
    if (user != null)
      return res.status(409).json({ message: "User already exists" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

//Middleware to check if User exist for Log-In
async function checkUsernameExists(req, res, next) {
  try {
    user = await User.findOne({
      username: req.body.username
    }).exec();
    if (user == null) {
      return res.status(401).json({ message: "Username is incorrect" });
    } else {
      res.user = user;
      next();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
