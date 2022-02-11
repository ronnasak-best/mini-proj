const express = require('express')
const router = express.Router()
const Product = require('../models/products')
const Cart = require('../models/cart')
const mongoose = require('mongoose')
const User = require('../models/user')

router.get('/', (req, res, next) => {
    res.locals.count = req.session.cart || 0
    Product.aggregate([{
        $match: {
            $and: [{ status: 1 }, { quantity: { $gt: 0 } }]
        }
    }, {
        $lookup: {
            from: "units", // collection name in db
            localField: "unit",
            foreignField: "_id",
            as: "unit"
        }
    }]).exec((err, products) => {
        Product.aggregate([{
            $group: { _id: '$category' }
        }, {
            $lookup: {
                from: 'categorys',
                localField: '_id',
                foreignField: '_id',
                as: 'categorise' // collection name in db
            }
        }]).exec((err, categorys) => {
            res.render('carts/index', { categorys: categorys, products: products, cat_select:'' })
        })
    })
})
router.get('/category/:id', async (req, res, next) => {
    res.locals.count = req.session.cart || 0
    Product.aggregate([{
        $match: {
            $and: [{ status: 1 }, { quantity: { $gt: 0 } }, { category: mongoose.Types.ObjectId(req.params.id) }]
        }
    }, {
        $lookup: {
            from: "categorys", // collection name in db
            localField: "category",
            foreignField: "_id",
            as: "categorise"
        }
    }, {
        $lookup: {
            from: "units", // collection name in db
            localField: "unit",
            foreignField: "_id",
            as: "unit"
        }
    }
    ]).exec((err, products) => {
        Product.aggregate([{
            $group: { _id: '$category' }
        }, {
            $lookup: {
                from: 'categorys',
                localField: '_id',
                foreignField: '_id',
                as: 'categorise'
            }
        }]).exec((err, categorys) => {
            res.render('carts/index', { categorys: categorys, products: products, cat_select: req.params.id })
        })
    })

})

router.get('/add-to-cart/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(productId) }
        }, {
            $lookup: {
                from: "units", // collection name in db
                localField: "unit",
                foreignField: "_id",
                as: "unit"
            }
        }
    ]).exec((err, product) => {
        if (err) {
            return res.redirect('carts/index')
        }
        if( cart.add(product, product[0]._id) ==false){        
            req.session.msg = {type: 'danger',msg: "มีแล้ว"}
            res.redirect(req.get('referer'))
        }else{
            req.session.cart = cart
            res.redirect(req.get('referer'))
        }    
    })
})

router.get('/increase/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('carts/index')
        }
        if( cart.addByOne(product, product.id )==false){        
            req.session.msg = {type: 'danger',msg: "จำนวนไม่เพียงพอ"}
            res.redirect(req.get('referer'))
        }else{
            req.session.cart = cart
            res.redirect(req.get('referer'))
        }
    })
})

router.get('/reduce/:id', function (req, res, next) {
    const productId = req.params.id
    const cart = new Cart(req.session.cart ? req.session.cart : {})
    cart.reduceByOne(productId)
    req.session.cart = cart
    res.redirect('/carts/cart')
})

router.get('/remove/:id', function (req, res, next) {
    const productId = req.params.id
    const cart = new Cart(req.session.cart ? req.session.cart : {})
    cart.removeItem(productId)
    req.session.cart = cart
    res.redirect('/carts/cart')
})

router.get('/cart', async (req, res, next) => {
    const users = await User.find({ role: 'user' })
    if (!req.session.cart) {
        return res.render('/cart', { products: null })
    }
    const cart = new Cart(req.session.cart)
    return res.render('carts/cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, users})
})

module.exports = router