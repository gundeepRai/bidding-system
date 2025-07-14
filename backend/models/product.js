const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    product_id: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    pname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    created_By: {
      type: String,
      ref: 'User',
      required: true,
      index: true,
    },
    biddingDeadline: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'products' }
);

module.exports = mongoose.model('Product', productSchema);
