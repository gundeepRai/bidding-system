const Product = require('../models/product');
const { generateProductId } = require('../utils/product.util');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { pname, description, startingPrice, biddingDeadline, created_By } = req.body;

    //const userId = req.user.user_id; // ✅ This must come from JWT middleware

    const productId = generateProductId(created_By, pname);

    const newProduct = new Product({
      product_id: productId,
      pname,
      description,
      startingPrice,
      biddingDeadline,
      created_By,
    });

    await newProduct.save();

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products added by a user
const getProductsByUser = async (req, res) => {
  try {
    const { created_By } = req.params;
    const products = await Product.find({ created_By: created_By }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific product by its ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.find({ product_id: productId });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProductsByUser,
  getProductById,
};
