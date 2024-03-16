const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  Category: {
    type: String,
    required: true
  },
  NameDigitalAsset: {
    type: String,
    required: true
  },
  Place: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
    required: true
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  ImageOfAsset: {
    type: String, // Assuming the image will be stored as a URL or file path
    required: false,
  }
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
