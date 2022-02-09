const express = require('express')
const router = express.Router()
const Disbursement = require('../models/disbursement')
// const Product = require('../models/products')
// const mongoose = require('mongoose')

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
module.exports = router