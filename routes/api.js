'use strict';
const fetch       = require('node-fetch')
const Stock       = require('../dbModels.js').Stock

const getPrice = async function(stock) {
  const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
  const responseJson = await response.json()
  const price = responseJson.latestPrice
  return price
}

const findStock = async function(stock, like, ip) {
  let foundStock = await Stock.findOne({ stockName: stock })
      if(foundStock === null){
        let newStock = new Stock({
          stockName: stock,
          likes: like==='true' ? [ip] : []
        })
        await newStock.save()
        return newStock.likes.length
      } else {
        if(like==='true'){
          if(!foundStock.likes.includes(ip)){
            foundStock.likes.push(ip)
            await foundStock.save()
          }
        }
      }
      return foundStock.likes.length
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let { stock, like } = req.query
      if(like){
        like = typeof like === 'string' ? like : like[0]
      }
      let ip = req.ip
      let price = 0;
      let likeAmount = 0;
      if(typeof stock === 'object'){
        stock[0] = stock[0].toUpperCase()
        stock[1] = stock[1].toUpperCase()
        let dataArray = []
        let likeAmount1 = await findStock(stock[0], like, ip)
        let likeAmount2 = await findStock(stock[1], like, ip)
        let price1 = await getPrice(stock[0])
        let price2 = await getPrice(stock[1])
        dataArray.push({ stock: stock[0], price: price1, rel_likes: likeAmount1 - likeAmount2})
        dataArray.push({ stock: stock[1], price: price2, rel_likes: likeAmount2 - likeAmount1})
        res.json({
          stockData: dataArray
        })
        return
      } else {
        stock = stock.toUpperCase()
        price = await getPrice(stock)
        likeAmount = await findStock(stock, like, ip)
        res.json({
          stockData: {
            stock: stock,
            price: price,
            likes: likeAmount
          }
        })
      }
    });
};
