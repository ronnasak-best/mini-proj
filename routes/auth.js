const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const Disbursement =require('../models/disbursement')

module.exports = isLoggedIn = async(req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.role == 'admin'){res.locals.disburse = await Disbursement.find({status:0}).count()}
        else{res.locals.disburse = await Disbursement.find({$and:[{user:req.user.id},{status:0}]}).count()}
        res.locals.user = req.user
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = isAdmin = async(req, res, next) => {
    const count = await Disbursement.find({status:0}).count()
    if (req.isAuthenticated() && req.user.role == 'admin') {
        res.locals.disburse =count
        res.locals.user = req.user
        next()
    } else {
        res.redirect('/')
    }
}


router.post('/register', async (req, res) => {
    const { username, password, name, lname, email } = req.body
    // simple validation
    if (!name || !lname || !username || !password || !email) {
        return res.render('register', { message: 'Please try again' })

    }

    const passwordHash = bcrypt.hashSync(password, 10)
    const user = new User({
        name,
        lname,
        email,
        username,
        password: passwordHash
    });

    await user.save()
    req.session.msg = {
        type: 'success',       
        msg: 'บันทึกข้อมูลเรียบร้อย'
      }
    res.redirect('../users')
});

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/',
        successRedirect: '/dashboard'
    }),
    async (req, res) => {
        const { username, password } = req.body
        return res.redirect('/') 

    }
);


module.exports = router