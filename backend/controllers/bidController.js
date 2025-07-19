const Bid = require('../models/bid');
const Product = require('../models/product');
const User = require('../models/user'); // ✅ Add this line
const { generateBidId } = require('../utils/bid.util');

const placeBid = async (req, res) => {
  try {
    const { productId } = req.params; // This is your custom product_id, not MongoDB _id
    const { bid_amount } = req.body;
    const bidder_id = req.user.user_id; // Extracted from JWT token

    // 1. Fetch product using custom product_id
    const product = await Product.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 2. Check deadline
    if (new Date() > new Date(product.biddingDeadline)) {
      return res.status(400).json({ error: 'Bidding deadline has passed' });
    }

    // 3. Generate unique bid_id
    const bid_id = generateBidId(productId, bidder_id);

    // 4. Create new bid
    const newBid = new Bid({
      bid_id,
      bid_by: bidder_id,
      product: productId,
      bid_amount,
    });

    // 5. Save and return
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

    //findin bids for the product, sort by bid_amoung descending 
    // const bids = await Bid.find({ product: productId })
    //   .populate({ path: 'bid_by', select: 'name email' }) 
    //   .sort({ bid_amount: -1 }); // highest first

    const bids = await Bid.find({ product: productId })
      .sort({ bid_amount: -1 })
      .populate({
        path: 'bid_by',
        select: 'name email',
        model: 'User',
        localField: 'bid_by',
        foreignField: 'user_id',
        justOne: true,
      });

    res.status(200).json({ success: true, bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bids by a user
const getBidsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bids = await Bid.find({ bid_by: userId })
      .populate({
        path: 'product',
        select: 'pname startingPrice product_id',
        model: 'Product',
        localField: 'product',
        foreignField: 'product_id',
        justOne: true,
      })
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

    // Get highest bid for the given product
    const highestBid = await Bid.findOne({ product: productId })
      .sort({ bid_amount: -1 })
      .lean(); // Make it a plain JS object

    if (!highestBid) {
      return res.status(404).json({ error: 'No bids found for this product' });
    }

    // Fetch user details manually based on bid_by (custom user_id)
    const user = await User.findOne({ user_id: highestBid.bid_by }).select('name email');

    res.status(200).json({
      success: true,
      highestBid: {
        ...highestBid,
        bidderDetails: user || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Get highest bid for a product
// const getHighestBid = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const highestBid = await Bid.find({ product: productId })
//       .sort({ bid_amount: -1 })
//       .limit(1)
//       .populate('bid_by', 'name email');

//     if (highestBid.length === 0) {
//       return res.status(404).json({ error: 'No bids found' });
//     }

//     res.status(200).json({ success: true, highestBid: highestBid[0] });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getWinnerAfterDeadline = async (req, res) => {
  try {
    const { productId } = req.params; // This is your custom product_id string

    // 1. Get the product using custom product_id
    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2. Check if bidding deadline has passed
    const currentTime = new Date();
    if (currentTime < product.biddingDeadline) {
      return res.status(403).json({
        message: "Bidding still in progress. Please wait until the deadline.",
        deadline: product.biddingDeadline,
      });
    }

    // 3. Get the highest bid for the product (indexed)
    const highestBid = await Bid.find({ product: productId })
      .sort({ bid_amount: -1 })
      .limit(1);

    if (highestBid.length === 0) {
      return res.status(404).json({ message: "No bids placed on this product" });
    }

    // 4. Fetch bidder details manually (since bid_by is a custom string id)
    const winner = await User.findOne({ user_id: highestBid[0].bid_by }).select('name email');

    return res.status(200).json({
      message: "Bidding has ended. Here is the winner:",
      winner,
      bidAmount: highestBid[0].bid_amount,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// const getWinnerAfterDeadline = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     // 1. Get the product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // 2. Check if deadline has passed
//     const currentTime = new Date();
//     if (currentTime < product.biddingDeadline) {
//       return res.status(403).json({
//         message: "Bidding still in progress. Please wait until the deadline.",
//         deadline: product.biddingDeadline,
//       });
//     }

//     // 3. Get the highest bid
//     const highestBid = await Bid.find({ product: productId })
//       .sort({ bidAmount: -1 })
//       .limit(1)
//       .populate('bidder', 'name email');

//     if (highestBid.length === 0) {
//       return res.status(404).json({ message: "No bids placed on this product" });
//     }

//     // 4. Return the winner
//     return res.status(200).json({
//       message: "Bidding has ended. Here is the winner:",
//       winner: highestBid[0].bidder,
//       bidAmount: highestBid[0].bidAmount,
//     });

//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };



module.exports = {
  placeBid,
  getBidsByProduct,
  getBidsByUser,
  getHighestBid,
  getWinnerAfterDeadline
};
