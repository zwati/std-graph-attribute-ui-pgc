// server/models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true, trim: true },
  subject:  { type: String, trim: true },
  // Teacher can be assigned to multiple classes/sections
  classes:  [{ class: String, section: String }],
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
