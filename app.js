const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user')
const Disbursement =require('./models/disbursement')
//router
const indexRouter = require('./routes/index')
const ProductRouter = require('./routes/product')
const CategoryRouter = require('./routes/category')
const StockRouter = require('./routes/stock')
const AuthRouter = require('./routes/auth')
const DashboardRouter =require('./routes/dashboard')
const DisburementRouter = require('./routes/disbursement')
const UnitRouter = require('./routes/unit')
const UserRouter = require('./routes/user')
const CheckoutRouter = require('./routes/checkout')
const CartRouter = require('./routes/carts')
const ReportRouter = require('./routes/report')

passport.use(
    new LocalStrategy((username, password, cb) => {
        User.findOne({$and:[{username:username},{status:true}]}, (err, user) => {
            if (err) {
                return cb(err)
            }
            if (!user) {
                return cb(null, false)
            }
            if (bcrypt.compareSync(password, user.password)) {
                return cb(null, user)
            }
            return cb(null, false)
        })
    })
)
passport.serializeUser((user, cb) => {
    cb(null, user._id);
})

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err)
        }
        cb(null, user)
    })
})


const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge : 3600000 }

}))



app.use((req, res, next)=>{
    res.locals.msg = req.session.msg
    delete req.session.msg
    next()
  })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.locals.moment = require('moment')
app.locals.moment.locale('th')

app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())


//router
app.use('/', indexRouter)
app.use('/product',isLoggedIn,ProductRouter)
app.use('/category',isAdmin, CategoryRouter)
app.use('/stock',isAdmin, StockRouter)
app.use('/dashboard',isLoggedIn,DashboardRouter)
app.use('/auth', AuthRouter)
app.use('/disbursement',isLoggedIn,DisburementRouter)
app.use('/carts',isLoggedIn,CartRouter)
app.use('/users',isLoggedIn,UserRouter)
app.use('/unit',isAdmin,UnitRouter)
app.use('/checkout',isLoggedIn,CheckoutRouter)
app.use('/reports',isAdmin,ReportRouter)





app.listen(3000, () => console.log("server is running...."))

