const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')
const Disbursement = require('../models/disbursement')
const Product = require('../models/products')
const mongoose = require('mongoose')
const AuthRouter = require('./auth')


router.get('/', isAdmin, (req, res, next) => {
    const timeElapsed=Date.now()
    const today = new Date(timeElapsed)
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
        res.render('disbursement/index', { disbursements: doc ,date:today.toLocaleDateString()})
    })

})

router.get('/user', (req, res) => {
    const timeElapsed=Date.now()
    const today = new Date(timeElapsed)
    Disbursement.aggregate([{
        $match: { user: mongoose.Types.ObjectId(req.user._id) }
    }, {
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
        //  console.log(doc);
        res.render('disbursement/index', { disbursements: doc ,date:today.toLocaleDateString()})
    })


})
router.get('/detail/(:id)', (req, res) => {
    Disbursement.aggregate([{
        $match: { _id: mongoose.Types.ObjectId(req.params.id) }
    }, {
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
        //  console.log(doc);
        res.render('disbursement/detail', { disbursement: doc })
    })


})

router.get('/adminConfirm/(:id)', (req, res, next) => {
    //ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข

    const update_id = req.params.id
    let data = {
        approver: req.user._id,
        status: 1,
        approver_date: Date.now()
    }
    //อัพเดตข้อมูล
    Disbursement.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(err => {
        res.redirect('/disbursement')
    })
})

router.get('/adminCancel/(:id)', async (req, res, next) => {

    //ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข
    const carts = await Disbursement.findOne({ _id: req.params.id })
    console.log(carts.cart.items);
    Object.values(carts.cart.items).forEach(async function (item) {

        try {
            const product = await Product.find({ _id: item.item[0]._id })
            const data = { quantity: product[0].quantity + item.qty };
            await Product.findByIdAndUpdate(item.item[0]._id, data, { useFindAndModify: false })
        }
        catch {
            res.status(400).send({ msg: 'error' })
        }
    })
    const update_id = req.params.id
    let data = {
        approver: req.user._id,
        status: 2
    }
    //อัพเดตข้อมูล
    Disbursement.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(err => {
        res.redirect('/disbursement')
    })
})
router.get('/pending', (req, res) => {
    const timeElapsed=Date.now()
    const today = new Date(timeElapsed)
    Disbursement.aggregate([{
        $match: { status: 0 }
    }, {
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
        //  console.log(doc);
        res.render('disbursement/index', { disbursements: doc ,date:today.toLocaleDateString()})
    })
})
router.get('/disapproved', (req, res) => {
    const timeElapsed=Date.now()
    const today = new Date(timeElapsed)
    Disbursement.aggregate([{
        $match: { status: 2 }
    }, {
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
        //  console.log(doc);
        res.render('disbursement/index', { disbursements: doc ,date:today.toLocaleDateString()})
    })
})


router.get('/search/(:id)', (req, res) => {
    let date = req.params.id
    let date_split = date.split('-')
    let year = date_split[0]
    let month = date_split[1]
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

    },{
        $match: {"$expr": { $and: [{ "$eq": [{ "$month": "$date" },parseInt(month)] }, { "$eq": [{ "$year": "$date" },parseInt(year)] }] }}
    }]).exec((err, doc) => {
       
         res.render('disbursement/index', { disbursements: doc ,date:date})
    })
})
module.exports = router