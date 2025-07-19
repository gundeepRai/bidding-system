const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');

const {
  createProduct,
  getProductsByUser,
  getProductById,
  getActiveProducts,
} = require('../controllers/productController');

// GET /api/products/active → Get all active products
router.get('/active', getActiveProducts);

// GET /api/products/user/:userId → Get user's products
router.get('/user/:created_By', getProductsByUser);

// GET /api/products/:productId → Get product details
router.get('/:productId', getProductById);

// POST /api/products → Create product
router.post('/', protect, createProduct);




module.exports = router;
