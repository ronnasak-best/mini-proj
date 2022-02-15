// ใช้งาน mongoose
const mongoose = require('mongoose')

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/InventoryDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// ออกแบบ Schema
let categorySchema = mongoose.Schema({
    category_id:String,
    name:String,
    description:String,
    status: {
        type: Boolean,
        default: true
    }
})

// สร้างโมเดล
let Category = mongoose.model("categorys",categorySchema)

// ส่งออกโมเดล
module.exports = Category

//ออกแบบฟังก์ชั่นสำหรับบันทึกข้อมูล
module.exports.saveCategory=function(model,data){
    model.save(data)
}