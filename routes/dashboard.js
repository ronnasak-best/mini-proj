const express = require('express')
const router = express.Router()
const Product = require('../models/products')


router.get('/', async (req, res, next) => {
    const products = await Product.find({quantity: {$lt: 50,$gt:0 }}).count()
    const products_out_of_stock = await Product.find({quantity: {$eq: 0 }}).count()
    const products_enable = await Product.find({status: 1 }).count()
    const products_disable = await Product.find({status: 0 }).count()
    res.render('index', {products,products_out_of_stock,products_enable,products_disable}) 
})

module.exports =router