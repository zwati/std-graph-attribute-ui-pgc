// server/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  customId:    { type: String, required: true, unique: true, trim: true },
  rollNumber:  { type: String, required: true, unique: true, index: true, trim: true },
  studentName: { type: String, required: true, trim: true },
  fatherName:  { type: String, required: true, trim: true },
  class:       { type: String, trim: true },
  section:     { type: String, trim: true },
  category:    { type: String, enum: ['Medical', 'Pre-Engineering', 'ICS', 'Others'], default: 'Others', trim: true },
  teacherId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', index: true },


  // Denormalized growth fields — updated on every evaluation submit (O(1) reads)
  growthIndex:     { type: Number, default: 0, min: 0, max: 100 },
  growthTrendEMA:  { type: Number, default: 0, min: 0, max: 100 },
  evaluationCount: { type: Number, default: 0 },
  lastEvaluatedAt: { type: Date, default: null },
}, { timestamps: true });

// Compound index for admin/teacher roster filtering
studentSchema.index({ class: 1, section: 1 });

module.exports = mongoose.model('Student', studentSchema);
