// server/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  generatedBy: { type: String, enum: ['parent', 'teacher', 'admin'], required: true },
  filePath:    { type: String },   // server-side path to generated PDF
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
