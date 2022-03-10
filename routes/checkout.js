const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')
const Disbursement =require('../models/disbursement')
const { customAlphabet } = require('nanoid/non-secure')
const Product = require('../models/products')

router.get('/', (req, res, next) => {
    const nanoid = customAlphabet('12345678', 8)
    if(!req.session.cart) {
        return res.redirect('/shopping-cart')
    }
    const cart = new Cart(req.session.cart)

    const data = new Disbursement({
        bill_number:nanoid(),
        user: req.user._id,
        cart: cart,
        status:0
    })
    Object.values(cart.items).forEach(async function(item){
        
        try{
            const product  = await Product.find({_id:item.item[0]._id})
            if(item.qty <= product[0].quantity ){
            const data = { quantity: product[0].quantity - item.qty };
            await  Product.findByIdAndUpdate(item.item[0]._id, data, { useFindAndModify: false })
            }
        }
        catch{
            res.status(400).send({msg:'error'})
        }
     })
    Disbursement.saveDisbursement(data, (err) => {
        if (err) console.log(err)
        req.session.cart=null
        res.redirect('/disbursement/user')
        
    })
   
})
router.post('/admin',(req, res, next) => {
    const nanoid = customAlphabet('12345678', 8)
    if(!req.session.cart) {
        return res.redirect('/shopping-cart')
    }
    const cart = new Cart(req.session.cart)
    const data = new Disbursement({
        bill_number:nanoid(),
        user: req.body.user,
        cart: cart,
        approver:req.user._id,
        status:1,
        approver_date : Date.now()
    })
     Object.values(cart.items).forEach(async function(item){
        
        try{
            const product  = await Product.find({_id:item.item[0]._id})
            if(item.qty <= product[0].quantity ){
            const data = { quantity: product[0].quantity - item.qty };
            await  Product.findByIdAndUpdate(item.item[0]._id, data, { useFindAndModify: false })
            }
        }
        catch{
            res.status(400).send({msg:'error'})
        }
     })
     Disbursement.saveDisbursement(data, (err) => {
         if (err) console.log(err)
       req.session.cart = null
       res.redirect('/disbursement')
    })
   
})


module.exports = router