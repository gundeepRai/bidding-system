// utils/bid.util.js

// bid id: BID_<product_id>_<bidder_id>_<timestamp>


const generateBidId = (productId, bidderId) => {
  const timestamp = Date.now(); // current UNIX ms timestamp
  return `BID_${productId}_${bidderId}_${timestamp}`;
};

module.exports = { generateBidId };
