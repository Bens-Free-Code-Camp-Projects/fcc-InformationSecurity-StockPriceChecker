const mongoose    = require('mongoose');
const stockSchema = new mongoose.Schema({
    stockName: String,
    likes: [String]
  })
  
  const Stock = mongoose.model('Stock', stockSchema)

  module.exports.Stock = Stock