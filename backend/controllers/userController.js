// controllers/userController.js
const User = require('../models/user');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getUserInfo = await(req, res) => {
//   try{
//     const {userId} = req.params;
//     const user = await user.findbyID(userId);

//     if(!user){
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const profile = 
//   }
// };

module.exports = {
  createUser,
  //getUserInfo
};
