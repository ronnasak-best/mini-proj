// ใช้งาน mongoose
const mongoose = require('mongoose')

// เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/InventoryDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// ออกแบบ Schema
let disbursementSchema = mongoose.Schema({
    bill_number: { type: String, unique: true },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    cart: { type: Object, required: true },
    approver: { type: mongoose.Schema.ObjectId, ref: 'adminUser' },
    status: {
        type: Number,
        enum: [0,1,2],
        default: 0
    },
    date: { type: Date, default: Date.now  },
    approver_date: { type: Date},
})

// สร้างโมเดล
let Disbursement = mongoose.model("disbursement",disbursementSchema)

// ส่งออกโมเดล
module.exports = Disbursement

//ออกแบบฟังก์ชั่นสำหรับบันทึกข้อมูล
module.exports.saveDisbursement=function(model,data){
    model.save(data)
}