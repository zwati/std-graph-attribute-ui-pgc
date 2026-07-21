// server/config/db.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminUsername = 'admin@pgc.com';
    const adminPassword = 'adminpgc';

    const existing = await User.findOne({ username: adminUsername });
    if (!existing) {
      await User.create({
        username: adminUsername,
        passwordHash: adminPassword,
        role: 'admin',
      });
      console.log(`🔑 Admin credentials created (Plaintext): ${adminUsername} | Password: ${adminPassword}`);
    } else {
      existing.passwordHash = adminPassword;
      await existing.save();
      console.log(`🔑 Admin credentials verified (Plaintext): ${adminUsername}`);
    }
  } catch (err) {
    console.error('⚠️ Admin seed failed:', err.message);
  }
};


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    await seedAdmin();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

