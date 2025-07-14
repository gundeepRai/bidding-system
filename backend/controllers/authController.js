const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateUserId } = require('../utils/user.util');

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'User already exists' });

    const userId = generateUserId(email);
    const newUser = new User({ user_id: userId, name, email, password });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email and password in login user",email, password)

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found.' });

    console.log("user found in login user", user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(200).json({ success: true, token, user: { id: user._id, user_id: user.user_id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
