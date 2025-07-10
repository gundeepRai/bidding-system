const Product = require('../models/product');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { title, description, startingPrice, biddingDeadline, userId } = req.body;

    const newProduct = new Product({
      title,
      description,
      startingPrice,
      biddingDeadline,
      createdBy: req.user,
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
    const { userId } = req.params;
    const products = await Product.find({ createdBy: userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific product by its ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('createdBy', 'name email');

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
