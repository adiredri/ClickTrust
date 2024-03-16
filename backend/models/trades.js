const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  IDtrans: {
        type: String,
        required: true,
  },
  AssetName: {
    type: String,
    required: true,
  },
  purchaseOrSale: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Date: {
    type: Date,
    required: true
  },
  Time: {
    type: String, 
    required: true
  }
});

// Define a unique compound index on CoinName and UserName
tradeSchema.index({ AssetName: 1, UserName: 1 }, { unique: true });

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
