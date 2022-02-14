// ใช้งาน mongoose
const mongoose = require('mongoose')

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/InventoryDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// ออกแบบ Schema
let stockSchema = mongoose.Schema({
    date: { type: Date, default: Date.now  },
    product_id: { type: mongoose.Schema.ObjectId, ref: 'Product'},
    quantity:Number,
    description:String,
})

// สร้างโมเดล
let Stock = mongoose.model("Stocks",stockSchema)

// ส่งออกโมเดล
module.exports = Stock

//ออกแบบฟังก์ชั่นสำหรับบันทึกข้อมูล
module.exports.saveStock=function(model,data){
    model.save(data)
}