const express = require('express') // Express web server framework
const router = express.Router() // Express Router
const mongoose = require('mongoose') // mongoose for mongodb
const multer = require('multer') // Multer handles file uploads
const Product = require('../models/products') // Mongoose model
const Category = require('../models/category') //
const { customAlphabet } = require('nanoid/non-secure')  //
const Unit = require('../models/unit') //
const AuthRouter = require('./auth') //



const storage = multer.diskStorage({ // ตำแหน่งจัดเก็บไฟล์
    destination: function (req, file, cb) {
        cb(null, './public/images/products') // ตำแหน่งจัดเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg")//เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำกัน
    }
})

//
const upload = multer({
    storage: storage // ตั้งค่า storage เป็น storage ที่เราสร้างขึ้นใหม่
})


// show all products
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
    ]).exec((err,products) => {
            res.render('product/index', {products: products }) // ส่งข้อมูลไปยังหน้า index.ejs
    })
})


router.get('/add',isAdmin, (req, res, next) => {
    Category.find({status:1}).exec((err, categorys) => { // ดึงข้อมูลจากฐานข้อมูล
        Unit.find({status:1}).exec((err, units) => { // ดึงข้อมูลจากฐานข้อมูล
            res.render('product/add', { categorys: categorys, units: units }) // ส่งข้อมูลไปยังหน้า add.ejs
        })

    })

})

// SAVE PRODUCT
router.post('/insert', upload.single("image"), async (req, res,) => {

    const category = await Category.findOne({ _id: req.body.category }) // หาหมวดหมู่ที่มี id ตรงกับที่ส่งมา
    const category_id = category.category_id

    const nanoid = customAlphabet('123456', 6) // สร้างรหัสสินค้
    let product_id = category_id + '-' + nanoid()

    // สร้างข้อมูลสินค้า
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
    // บันทึกข้อมูลสินค้า
    Product.saveProduct(data, (err) => {
        if (err) console.log(err) // ถ้ามีข้อผิดพลาด
        req.session.msg = {type: 'success',msg: 'บันทึกเรียบร้อย'} // สร้าง session สำหรับแจ้งเตือน
        res.redirect('/product') // สั่งให้ไปหน้าที่เราต้องการ
    })
})




// EDIT PRODUCT
router.get('/edit/(:id)', async(req, res, next) => {
    const edit_id = req.params.id // รับ id ที่ส่งมา
    const unit = await Unit.find({status:1}) // หาหน่วยนับทั้งหมด
    const category = await Category.find({status:1}) // หาหมวดหมู่ทั้งหมด

    Product.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(edit_id) } // หาข้อมูลสินค้าที่มี id ตรงกับที่ส่งมา
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
            res.render('product/edit', { categorys: category, product: products ,unit}) // ส่งข้อมูลหมวดหมู่ทั้งหมดให้หน้า edit
    })
})




// UPDATE PRODUCT
router.post('/update', upload.single("image"), (req, res, next) => {
    //ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข
    const update_id = req.body.update_id // รับ id ที่ส่งมา
    
    if (req.file) { // ถ้ามีการเปลี่ยนรูปภาพ
        filename = req.file.filename // รับชื่อรูปภาพที่ส่งมา
    } else { // ถ้าไม่มีการเปลี่ยนรูปภาพ
        filename = req.body.img // รับชื่อรูปภาพที่เก่ามา
    }

    // ข้อมูลใหม่ที่จะแก้ไข
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

    // ส่งข้อมูลไปที่ model เพื่อทำการอัพเดต
    Product.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(err => {
        req.session.msg = {type: 'success',msg: 'แก้ไขเรียบร้อย'}
        res.redirect('/product') // สั่งให้ไปหน้าที่เราต้องการ
    })

})




module.exports = router