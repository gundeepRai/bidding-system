const express = require('express');
const router = express.Router();
//const protect = require('../middlewares/authMiddleware');

const {
  createProduct,
  getProductsByUser,
  getProductById,
} = require('../controllers/productController');

// POST /api/products → Create product
router.post('/', createProduct);

// GET /api/products/user/:userId → Get user's products
router.get('/created_By/:created_By', getProductsByUser);

// GET /api/products/:productId → Get product details
router.get('/:productId', getProductById);

module.exports = router;
