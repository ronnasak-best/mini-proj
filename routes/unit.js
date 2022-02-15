const express = require('express')
const router = express.Router()
const Unit = require('../models/unit')

router.get('/', (req, res, next) => {
    Unit.find().exec((err, doc) => {
        res.render('unit/index', { unit: doc})
    })

})
router.get('/add',(req,res,next)=>{
    res.render('unit/add');
})

router.post('/insert', (req, res) => {
let data = new Unit({
        name: req.body.name,
        status: req.body.status,
    })
    Unit.saveUnit(data, (err) => {
        if (err) console.log(err)
        res.redirect('/unit')
    })
})

router.get('/edit/(:id)',(req,res,next)=>{
    const edit_id = req.params.id
    Unit.findOne({_id:edit_id}).exec((err,doc)=>{
      //console.log(category)
        res.render('unit/edit',{unit:doc})
    })
})

router.post('/update',(req,res,next)=>{
    //ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข
    const update_id = req.body.update_id
    let data = {
        name:req.body.name,
        status:req.body.status
    }
    //อัพเดตข้อมูล
    Unit.findByIdAndUpdate(update_id,data,{useFindAndModify:false}).exec(err=>{
        res.redirect('/unit')
    })
})

router.post('/status',(req,res,next)=>{
    const id = req.body.id
    const status = req.body.status
    Unit.findByIdAndUpdate(id,{status:status},{useFindAndModify:false}).exec(err=>{
        if(err) console.log(err)
        
    })
})
module.exports = router
