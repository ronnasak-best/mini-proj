const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Product = require('../models/products')
const { customAlphabet } = require('nanoid/non-secure')
const { log } = require('npmlog')

router.get('/',(req,res,next)=>{
    Category.find().exec((err,doc)=>{
        res.render('category/index',{category:doc})
    })
})

router.get('/add',(req,res,next)=>{
    res.render('category/add');
})

router.post('/insert',(req,res,next)=>{
    const nanoid = Math.floor(Math.random() * 100)
    let data = new Category({
        category_id:nanoid,
        name:req.body.name,
        description:req.body.description,
        status:req.body.status
    })
    Category.saveCategory(data,(err)=>{
        if(err) console.log(err)
        req.session.msg = {type: 'success',msg: 'บันทึกเรียบร้อย'}
        res.redirect('/category')
    })
})


router.get('/edit/(:id)',(req,res,next)=>{
    const edit_id = req.params.id
    Category.findOne({_id:edit_id}).exec((err,doc)=>{
      //console.log(category)
        res.render('category/edit',{category:doc})
    })
})

router.post('/update',(req,res,next)=>{
    //ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข
    const update_id = req.body.update_id
    let data = {
        category_id:req.body.category_id,
        name:req.body.name,
        description:req.body.description,
        status:req.body.status
    }
    //อัพเดตข้อมูล
    Category.findByIdAndUpdate(update_id,data,{useFindAndModify:false}).exec(err=>{
        req.session.msg = {type: 'success',msg: 'แก้ไขเรียบร้อย'}
        res.redirect('/category')
    })
})

router.post('/status/', async(req,res,next)=>{
    const id = req.body.id
    const status = req.body.status
    const products = await Product.find({category:id})
    if(status == 'false'){
        for(let i=0;i<products.length;i++){ 
            products[i].status = 'false'
            await products[i].save()
        }
    }else if(status == 'true'){
        for(let i=0;i<products.length;i++){
            products[i].status = 'true'
            await products[i].save()
        }
    }
    Category.findByIdAndUpdate(id,{status:status},{useFindAndModify:false}).exec(err=>{
        if(err) console.log(err)
    })

})


module.exports = router