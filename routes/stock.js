const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/products')
const Stock = require('../models/stock')

router.get('/', (req, res, next) => {
    
    Product.aggregate([{
        $lookup: {
            from: "categorys", // collection name in db
            localField: "category",
            foreignField: "_id",
            as: "categorise"
        }
    }
        , {
        $lookup: {
            from: "units", // collection name in db
            localField: "unit",
            foreignField: "_id",
            as: "unit"
        }

    }]).exec((err, doc) => {
        res.render('stock/index', { product: doc })

    })

})

router.get('/stock_detail/(:id)', (req, res, next) => {
    const product_id = req.params.id
    Product.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(product_id) }
        }, {
            $lookup: {
                from: "categorys", // collection name in db
                localField: "category",
                foreignField: "_id",
                as: "categorise"
            }
        },
        {
            $lookup: {
                from: "units", // collection name in db
                localField: "unit",
                foreignField: "_id",
                as: "unit"
            }
        }]).exec((err, doc) => {
            Stock.find({product_id}).exec((err, stock) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('stock/stock_detail', {stocks:stock,product: doc})
                }
            })
        })
})


router.get('/add/(:id)', (req, res) => {
    const product_id = req.params.id
    Product.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(product_id) }
        }, {
            $lookup: {
                from: "categorys", // collection name in db
                localField: "category",
                foreignField: "_id",
                as: "categorise"
            }
        },
        {
            $lookup: {
                from: "units", // collection name in db
                localField: "unit",
                foreignField: "_id",
                as: "unit"
            }
        }]).exec((err, doc) => {
            res.render('stock/add', { product: doc })
        })
})
router.post('/insert', (req, res) => {
    const quantity = req.body.quantity
    Product.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.product_id) },
        { $inc: { quantity: +quantity, "metrics.orders": 1 } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
        });
    let data = new Stock({
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description,
    })
    Stock.saveStock(data, (err) => {
        if (err) console.log(err)
        res.redirect('/stock')
    })
})
module.exports = router
