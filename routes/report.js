const express = require('express')
const router = express.Router()
const Disbursement = require('../models/disbursement')
const Product = require('../models/products')
const Category = require('../models/category')
const mongoose = require('mongoose')

function Pro(proOld) {
    this.item = proOld.item || {}
    this.add = function (item, id, qty) {
        let dsr = this.item[id]
        if (!dsr) {
            dsr = this.item[id] = {
                item: item,
                qty: 0,
            }
            dsr.qty = qty
        }
        else {
            dsr.qty += qty
        }
    }

}

router.get('/disbursement_report', async (req, res, next) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const categorys = await Category.find({ status: true })
    Disbursement.aggregate([{
        $match: { status: 1 }
    },
    {
        $group: { _id: "$cart.items", }
    }
    ]).exec((err, doc) => {
        let pro = new Pro({})
        for (let i = 0; i < doc.length; i++) {
            // console.log(doc[i]._id)
            Object.values(doc[i]._id).forEach(function (items) {
                if (items.status == true) {
                    pro.add(items.item[0], items.item[0]._id, items.qty)
                }
            })
        }

        res.render('report/disbursement_report', { categorys, disbursements: pro, startDate: today.toISOString().slice(0, 10), endDate: today.toISOString().slice(0, 10) })

    })

})
router.get('/disbursement_report/search/(:start)/(:end)', async(req, res) => {
    const startDate = req.params.start +'-01'
    const endDate = req.params.end+'-31'
    const categorys = await Category.find({ status: true })
    Disbursement.aggregate([{
        $match: { $and: [{ date: { $gte: new Date(startDate), $lte: new Date(endDate) } }, { status: 1 }] }
        // $match: { "$expr": { $and: [{ "$eq": [{ "$month": "$date" }, parseInt(month)] }, { "$eq": [{ "$year": "$date" }, parseInt(year)] }] } }
    },
    {
        $group: { _id: "$cart.items", }
    }
    ]).exec((err, doc) => {
        let pro = new Pro({})
        for (let i = 0; i < doc.length; i++) {
            // console.log(doc[i]._id)
            Object.values(doc[i]._id).forEach(function (items) {
                if (items.status == true) {
                    pro.add(items.item[0], items.item[0]._id, items.qty)
                }
            })
        }
        res.render('report/disbursement_report', { categorys,disbursements: pro, startDate, endDate })

    })
})

















router.get('/out_of_stock', (req, res, next) => {
    Product.aggregate([
        {
            $match: { quantity: { $eq: 0 } }
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

router.get('/almost_stock', (req, res, next) => {
    Product.aggregate([
        {
            $match: { quantity: { $lt: 50, $gt: 0 } }
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