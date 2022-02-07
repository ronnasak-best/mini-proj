const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login');
})
router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })
module.exports = router