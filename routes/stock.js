const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/products')
const Stock = require('../models/stock')

router.get('/', (req, res, next) => {
    
    Product.aggregate([{
        $match: {status :true}
    },{
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
        req.session.msg = {type: 'success',msg: 'บันทึกเรียบร้อย'}
        res.redirect('/stock/stock_detail/' + req.body.product_id)
    })
})

router.get('/edit/(:id)', (req, res) => {
    const stock_id = req.params.id
    Stock.findById(stock_id, (err, stock) => {
        if (err) console.log(err)
        Product.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(stock.product_id) }
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
                res.render('stock/edit', { stock: stock, product: doc })
            })
    })
})

router.post('/update', (req, res) => {
    const quantity = req.body.quantity //new quantity
    const price = req.body.price
    const description = req.body.description
    const old_quantity = req.body.old_quantity //old quantity
    if (old_quantity > quantity) {
        Product.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.product_id) },
            { $inc: { quantity: -(old_quantity - quantity), "metrics.orders": -1 } }, function (err, docs) {
                if (err) {
                    console.log(err)
                }
            })         
    }else if(old_quantity < quantity){
        Product.updateOne(
            { _id: mongoose.Types.ObjectId(req.body.product_id) },
            { $inc: { quantity: +(quantity - old_quantity), "metrics.orders": 1 } }, function (err, docs) {
                if (err) {
                    console.log(err)
                }
            })
        
    }
    Stock.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.stock_id) },
        { $set: { quantity: quantity, price: price, description: description } }, function (err, docs) {
            if (err) {
                console.log(err)
            }
        })
        req.session.msg = {
            type: 'success',
            msg: 'แก้ไขเรียบร้อย'
          }
    res.redirect('/stock/stock_detail/' + req.body.product_id)
})

module.exports = router
