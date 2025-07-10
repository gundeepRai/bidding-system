// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

// POST /api/users
router.post('/', createUser);

// get /api/<userid>
// router.get('/:userId', getUserInfo);

module.exports = router;
