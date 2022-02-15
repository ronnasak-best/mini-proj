const express = require("express")
const router = express.Router()
const User = require("../models/user")
const AuthRouter = require('./auth')
const bcrypt = require('bcrypt')


router.get("/", isAdmin, (req, res, next) => {
  User.find().exec((err, doc) => {
    res.render("user/index", { user_list: doc });
  })
})

router.get("/add", isAdmin, (req, res, next) => {
  res.render("user/add")
})

router.get("/default-password/(:id)", isAdmin, (req, res, next) => {
  const update_id = req.params.id
  const passwordHash = bcrypt.hashSync("12345678", 10)
  let data = {
    password: passwordHash
  }
  User.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(
    (err) => {
      req.session.msg = {
        type: 'success',
        msg: 'รหัสผ่านรีเช็ตเรียบร้อย'
      }

      res.redirect("/users");
    }
  )
})

router.get("/reset-password", (req, res, next) => {
  User.findById({ _id: req.user.id }).exec((eer, doc) => {
    res.render('user/reset-password', { user_list: doc })
  })

})


router.post("/confirm-password", async (req, res, next) => {
  User.findById({ _id: req.body.update_id }, (err, user) => {
    if (bcrypt.compareSync(req.body.oldpassword,user.password)) {
      const passwordHash = bcrypt.hashSync(req.body.newpassword, 10)
      User.findByIdAndUpdate(req.body.update_id, {password:passwordHash}, { useFindAndModify: false }).exec(
        (err) => {
          req.session.msg = {type: 'success',msg: 'บันทึกข้อมูลเรียบร้อย'}
            res.redirect('/dashboard')
        }
      )
    } else {
      req.session.msg = {type: 'danger',msg: 'รหัสผ่านเก่าไมถูกต้อง'}
      res.redirect(req.get('referer'))
    }
  
  })
})

router.get("/edit/(:id)", isAdmin, (req, res, next) => {
  const edit_id = req.params.id;
  User.findOne({ _id: edit_id }).exec((err, doc) => {
    //console.log(category)
    res.render("user/edit", { user_list: doc })
  })
})

router.post("/update", isAdmin, (req, res, next) => {
  //ข้อมูลใหม่ที่ถูกส่งมาจากฟอร์มแก้ไข
  const update_id = req.body.update_id;
  let data = {
    name: req.body.name,
    lname: req.body.lname,
    email: req.body.email,
    username: req.body.username,
    role: req.body.role,
    status: req.body.status,
  }
  //อัพเดตข้อมูล
  User.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(
    (err) => {
      req.session.msg = {
        type: 'success',
        msg: 'บันทึกข้อมูลเรียบร้อย'
      }
      res.redirect("/users");
    }
  )
})

router.post('/status', isAdmin, (req, res, next) => {
  const id = req.body.id
  User.findByIdAndUpdate(id, {status:req.body.status}, { useFindAndModify: false }).exec(
    (err) => {
     if(err) {
       req.session.msg = {type: 'danger',msg: 'เกิดข้อผิดพลาด'}
     }
    })
})

module.exports = router;
