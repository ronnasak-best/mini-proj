// ใช้งาน mongoose
const mongoose = require('mongoose')

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/InventoryDB'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// ออกแบบ Schema
let userSchema = mongoose.Schema({
    name: String,
    lname:String,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
      },
      status: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
})

// สร้างโมเดล
let User = mongoose.model("User", userSchema)

// ส่งออกโมเดล
module.exports = User