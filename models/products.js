// ใช้งาน mongoose
const mongoose = require('mongoose')

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/InventoryDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// ออกแบบ Schema
let productSchema = mongoose.Schema({
    code:String,
    name:String,
    category: { type: mongoose.Schema.ObjectId, ref: 'Category'},
    unit:{ type: mongoose.Schema.ObjectId, ref: 'Unit'},
    quantity: {
        type: Number,
        default: 0
    },
    image:String,
    description:String,
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
    
    
})

// สร้างโมเดล
let Product = mongoose.model("products",productSchema)

// ส่งออกโมเดล
module.exports = Product

//ออกแบบฟังก์ชั่นสำหรับบันทึกข้อมูล
module.exports.saveProduct=function(model,data){
    model.save(data)
}