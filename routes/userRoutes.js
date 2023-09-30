const express = require('express');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().select('-__v');
  res.json({ message: 'Displaying users', users });
});

router.get('/:id', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v -password');
  if (!user || user.isDeleted) return res.status(404).send('User not found or deleted');
  res.json({ message: "Displaying user with ID: " + req.params.id, user });
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;

    // Find the user by ID and make sure they are not deleted
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found or deleted' });

    // Update fields
    user.username = username;
    user.email = email;
    user.contactNumber = contactNumber;
    if (password) {
      user.password = password;
    }

    // Save the user, triggering the pre('save') middleware
    await user.save();

    // Remove sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse.isDeleted;

    res.json({ message: "Updated user with ID: " + user._id, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.isDeleted) return res.status(404).send('User not found or already deleted');
  user.isDeleted = true;
  await user.save();
  res.json({ message: 'User soft-deleted' });
});

module.exports = router;
