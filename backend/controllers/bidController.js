const Bid = require('../models/bid');
const Product = require('../models/product');

// Place a bid
const placeBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const { bidderId, bidAmount } = req.body;

    // Fetch product and check deadline
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (new Date() > new Date(product.biddingDeadline)) {
      return res.status(400).json({ error: 'Bidding deadline has passed' });
    }

    // Save bid
    const newBid = new Bid({
      product: productId,
      bidder: bidderId,
      bidAmount,
    });

    await newBid.save();
    res.status(201).json({ success: true, bid: newBid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bid history for a product
const getBidsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const bids = await Bid.find({ product: productId })
      .populate('bidder', 'name email')
      .sort({ bidAmount: -1 }); // highest first

    res.status(200).json({ success: true, bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bids by a user
const getBidsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bids = await Bid.find({ bidder: userId })
      .populate('product', 'title startingPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get highest bid for a product
const getHighestBid = async (req, res) => {
  try {
    const { productId } = req.params;

    const highestBid = await Bid.find({ product: productId })
      .sort({ bidAmount: -1 })
      .limit(1)
      .populate('bidder', 'name email');

    if (highestBid.length === 0) {
      return res.status(404).json({ error: 'No bids found' });
    }

    res.status(200).json({ success: true, highestBid: highestBid[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWinnerAfterDeadline = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. Get the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2. Check if deadline has passed
    const currentTime = new Date();
    if (currentTime < product.biddingDeadline) {
      return res.status(403).json({
        message: "Bidding still in progress. Please wait until the deadline.",
        deadline: product.biddingDeadline,
      });
    }

    // 3. Get the highest bid
    const highestBid = await Bid.find({ product: productId })
      .sort({ bidAmount: -1 })
      .limit(1)
      .populate('bidder', 'name email');

    if (highestBid.length === 0) {
      return res.status(404).json({ message: "No bids placed on this product" });
    }

    // 4. Return the winner
    return res.status(200).json({
      message: "Bidding has ended. Here is the winner:",
      winner: highestBid[0].bidder,
      bidAmount: highestBid[0].bidAmount,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



module.exports = {
  placeBid,
  getBidsByProduct,
  getBidsByUser,
  getHighestBid,
  getWinnerAfterDeadline
};
