const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Stock  = require('../dbModels.js').Stock

chai.use(chaiHttp);

suite('Functional Tests', function() {
    after(() => {
        Stock.collection.drop()
    })

    test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
        chai.request(server).get('/api/stock-prices').query({ stock: 'tsla' }).end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData.stock, 'TSLA')
            assert.equal(res.body.stockData.price, 197.56)
            assert.equal(res.body.stockData.likes, 0)
            done();
        })
    })
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
        chai.request(server).get('/api/stock-prices').query({ stock: 'tsla', like: 'true' }).end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData.stock, 'TSLA')
            assert.equal(res.body.stockData.price, 197.56)
            assert.equal(res.body.stockData.likes, 1)
            done();
        })
    })
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
        chai.request(server).get('/api/stock-prices').query({ stock: 'tsla', like: 'true' }).end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData.stock, 'TSLA')
            assert.equal(res.body.stockData.price, 197.56)
            assert.equal(res.body.stockData.likes, 1)
            done();
        })
    })
    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server).get('/api/stock-prices').query({ stock: ['tsla', 'goog'] }).end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData[0].stock, 'TSLA')
            assert.equal(res.body.stockData[0].price, 197.56)
            assert.equal(res.body.stockData[0].rel_likes, 1)
            assert.equal(res.body.stockData[1].stock, 'GOOG')
            assert.equal(res.body.stockData[1].price, 105.86)
            assert.equal(res.body.stockData[1].rel_likes, -1)
            done();
        })
    })
    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
        chai.request(server).get('/api/stock-prices').query({ stock: ['tsla', 'goog'], like:'true' }).end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData[0].stock, 'TSLA')
            assert.equal(res.body.stockData[0].price, 197.56)
            assert.equal(res.body.stockData[0].rel_likes, 0)
            assert.equal(res.body.stockData[1].stock, 'GOOG')
            assert.equal(res.body.stockData[1].price, 105.86)
            assert.equal(res.body.stockData[1].rel_likes, 0)
            done();
        })
    })
});
