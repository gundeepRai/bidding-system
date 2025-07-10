const mongoose = require('mongoose');
const { Schema } = mongoose;

const bidSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    bidder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'bids' }
);

module.exports = mongoose.model('Bid', bidSchema);
