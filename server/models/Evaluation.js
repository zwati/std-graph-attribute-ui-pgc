// server/models/Evaluation.js
// One document per teacher evaluation session per student
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },

  communication:  { type: Number, required: true, min: 1, max: 5 },
  participation:  { type: Number, required: true, min: 1, max: 5 },
  discipline:     { type: Number, required: true, min: 1, max: 5 },
  teamwork:       { type: Number, required: true, min: 1, max: 5 },
  responsibility: { type: Number, required: true, min: 1, max: 5 },
  leadership:     { type: Number, required: true, min: 1, max: 5 },


  remarks: { type: String, maxlength: 1000, trim: true },

  // Snapshot of growth index at time of submit — never recalculated
  growthIndexAtSubmit: { type: Number },

  // "YYYY-MM" format — indexed for monthly trend queries
  month: { type: String, index: true },
}, { timestamps: true });

// Compound indexes (also create these in Compass → Indexes tab)
evaluationSchema.index({ studentId: 1, month: -1 });        // student history by month
evaluationSchema.index({ studentId: 1, createdAt: -1 });    // latest evaluation first

module.exports = mongoose.model('Evaluation', evaluationSchema);
