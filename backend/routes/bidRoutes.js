const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  placeBid,
  getBidsByProduct,
  getBidsByUser,
  getHighestBid,
  getWinnerAfterDeadline
} = require('../controllers/bidController');

// POST /api/bids/:productId → Place bid and only logged in user can place bids only
router.post('/:productId', protect, placeBid);

// GET /api/bids/:productId → Get product bid history
router.get('/:productId', getBidsByProduct);

// GET /api/bids/user/:userId → Get all bids by user
router.get('/user/:userId', getBidsByUser);

// GET /api/bids/highest/:productId
router.get('/highest/:productId', getHighestBid);

// GET /api/bids/winner/:productId → Get winner after bidding deadline
router.get('/winner/:productId', getWinnerAfterDeadline); 

module.exports = router;
