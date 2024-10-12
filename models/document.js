const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  topic: { type: String, required: true },   // หัวข้อของเอกสาร
  writer: { type: String, required: true },  // ผู้เขียนของเอกสาร
  content: { type: String, required: true }  // เนื้อหาเอกสาร
});

// สร้างโมเดล Document จาก DocumentSchema
module.exports = mongoose.model('Document', DocumentSchema);
