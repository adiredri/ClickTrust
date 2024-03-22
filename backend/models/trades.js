const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  DateTrans: {
    type: Date,
    required: true,
  },
  TimeTrans: {
    type: String,
    required: true
  },
  AssetID: {
    type: String,
    required: true
  },
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
  EmailSeller: {
    type: String,
    required: true,
  },
  EmailBuyer: {
    type: String,
    required: true,
  },

});

// Define a unique compound index on CoinName and UserName
tradeSchema.index({ EmailSeller: 1, EmailBuyer: 1 }, { unique: true });

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
