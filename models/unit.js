// ใช้งาน mongoose
const mongoose = require('mongoose')

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/InventoryDB'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// ออกแบบ Schema
let unitSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
})

// สร้างโมเดล
let Unit = mongoose.model("Unit", unitSchema)

// ส่งออกโมเดล
module.exports = Unit

//ออกแบบฟังก์ชั่นสำหรับบันทึกข้อมูล
module.exports.saveUnit = function (model, data) {
    model.save(data)
}