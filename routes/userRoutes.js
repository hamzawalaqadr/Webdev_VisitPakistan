const express = require('express');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  const users = await User.find().select('-__v -password');
  res.json({ message: 'Displaying users', users });
});

router.get('/:id', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v -password');
  if (!user || user.isDeleted) return res.status(404).send('User not found or deleted');
  res.json({ message: "Displaying user with ID: " + req.params.id, user });
});

router.put('/:id', verifyToken, async (req, res) => {
  const { username, password, email, contactNumber } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { username, password, email, contactNumber },
    { new: true }
  ).select('-__v');
  if (!user) return res.status(404).send('User not found or deleted');
  res.json({ message: 'Updated user', user });
});

router.delete('/:id', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.isDeleted) return res.status(404).send('User not found or already deleted');
  user.isDeleted = true;
  await user.save();
  res.json({ message: 'User soft-deleted' });
});

module.exports = router;
