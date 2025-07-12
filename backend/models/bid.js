const mongoose = require('mongoose');
const { Schema } = mongoose;

const bidSchema = new Schema(
  {
    bid_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bid_by: {
      type: String,
      required: true,
      index: true,
      ref: 'User',
    },
    product: {
      type: String, // hashed product_id
      required: true,
      index: true,
      ref: 'Product',
    },
    bid_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    bid_time: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'bids' }
);

module.exports = mongoose.model('Bid', bidSchema);
