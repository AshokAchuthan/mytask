const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productCount: {
    type: Number,
    required: true,
  },
  subcategories: [
    {
      name: {
        type: String,
        required: true,
      },
      productCount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
