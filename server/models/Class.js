// server/models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: { type: String, required: true, trim: true },
  category:  { type: String, enum: ['Medical', 'Pre-Engineering', 'ICS', 'Others'], required: true },
  section:   { type: String, required: true, trim: true },
}, { timestamps: true });

classSchema.index({ className: 1, section: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
