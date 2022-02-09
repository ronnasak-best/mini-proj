const express = require('express')
const router = express.Router()
const Disbursement = require('../models/disbursement')
const Product = require('../models/products')
const mongoose = require('mongoose')

router.get('/disbursement_report',(req, res, next) => {
    Disbursement.aggregate([{
        $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
        }
    }, {
        $lookup: {
            from: 'users',
            localField: 'approver',
            foreignField: '_id',
            as: 'approver'
        }
    }]).exec((err, doc) => {
        res.render('report/disbursement_report', { disbursements: doc })
    })

})
router.get('/out_of_stock',(req, res, next) => {
    Product.aggregate([
        {
            $match: { quantity: { $eq: 0 }}
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
        }]).exec((err, doc) => {
        res.render('report/out_of_stock', { products: doc })
    })

})

router.get('/almost_stock',(req, res, next) => {
    Product.aggregate([
        {
            $match: { quantity: { $lt: 100 }}
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
        }]).exec((err, doc) => {
        res.render('report/almost_stock', { products: doc })
    })

})


module.exports = router