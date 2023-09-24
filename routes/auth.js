const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateTokens = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    contactNumber: user.contactNumber
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });

  return { accessToken, refreshToken };
};

router.post('/register', async (req, res) => {
  const { username, password, email, contactNumber } = req.body;

  // Check if username or email already exists
  const existingUserByUsername = await User.findOne({ username });
  const existingUserByEmail = await User.findOne({ email });

  if (existingUserByUsername) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  if (existingUserByEmail) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const user = new User({ username, password, email, contactNumber });
  await user.save();
  res.json({ message: 'Registration successful' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, isDeleted: false });
  if (!user) return res.status(400).send('Invalid username or user is deleted');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid password');

  const { accessToken, refreshToken } = generateTokens(user);

  res.json({ message: 'Login successful', accessToken, refreshToken });
});

// Refresh Token Route
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user || user.isDeleted) return res.status(404).json({ message: 'User not found or deleted' });

    const { accessToken } = generateTokens(user);
    res.json({ message: 'Access token refreshed', accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;
