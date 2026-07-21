// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['admin', 'teacher', 'parent'], required: true },
  // For 'parent' role: links to the Student._id this parent can view
  linkedId:     { type: mongoose.Schema.Types.ObjectId, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
