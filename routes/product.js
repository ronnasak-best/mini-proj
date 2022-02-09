const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const Product = require('../models/products')
const Category = require('../models/category')
const { customAlphabet } = require('nanoid/non-secure')
const Unit = require('../models/unit')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/products') // ตำแหน่งจัดเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg")//เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำกัน
    }
})

const upload = multer({
    storage: storage
})

router.get('/', (req, res, next) => {
    Product.aggregate([{
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

            as: "units"
        }
    }
    ]).exec((err, doc) => {
        res.render('product/index', { product: doc })

    })

})

router.get('/add', (req, res, next) => {
    Category.find({status:1}).exec((err, categorys) => {
        Unit.find({status:1}).exec((err, units) => {
            res.render('product/add', { categorys: categorys, units: units })
        })

    })

})

router.post('/insert', upload.single("image"), async (req, res,) => {
    const category = await Category.findOne({ _id: req.body.category })
    const category_id = category.category_id
    const nanoid = customAlphabet('123456', 6)
    let product_id = category_id + '-' + nanoid()
    let data = new Product({
        code: product_id,
        name: req.body.name,
        category: req.body.category,
        unit: req.body.unit,
        quantity: req.body.quantity,
        image: req.file.filename,
        description: req.body.description,
        status: req.body.status
    })
    Product.saveProduct(data, (err) => {
        if (err) console.log(err)
        req.session.msg = {type: 'success',msg: 'บันทึกเรียบร้อย'}
        res.redirect('/product')
    })


})

router.get('/edit/(:id)', async(req, res, next) => {
    const edit_id = req.params.id
    const unit = await Unit.find({status:1})
    Product.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(edit_id) }
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
        Category.find({status:1}).exec((err, category) => {
            res.render('product/edit', { categorys: category, product: products ,unit})
        })
    })
})

router.post('/update', upload.single("image"), (req, res, next) => {
    //ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข
    const update_id = req.body.update_id
    if (req.file) {
        filename = req.file.filename
    } else {
        filename = req.body.img
    }

    let data = {
        code: req.body.code,
        name: req.body.name,
        category: req.body.category,
        unit: req.body.unit,
        quantity: req.body.quantity,
        image: filename,
        description: req.body.description,
        status: req.body.status
    }
    //อัพเดตข้อมูล
    //console.log(category_id)
    Product.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(err => {
        req.session.msg = {type: 'success',msg: 'แก้ไขเรียบร้อย'}
        res.redirect('/product')
    })

})




module.exports = router