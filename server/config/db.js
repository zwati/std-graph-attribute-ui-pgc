// server/config/db.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

const Teacher  = require('../models/Teacher');

const seedDefaultUsers = async () => {
  try {
    // 1. Seed Admin (admin@pgc.com / adminpgc)
    const adminUsername = 'admin@pgc.com';
    const adminPassword = 'adminpgc';
    let adminUser = await User.findOne({ username: adminUsername });
    if (!adminUser) {
      adminUser = await User.create({
        username: adminUsername,
        passwordHash: adminPassword,
        role: 'admin',
      });
      console.log(`🔑 Admin credentials created: ${adminUsername} | Password: ${adminPassword}`);
    } else {
      adminUser.passwordHash = adminPassword;
      await adminUser.save();
      console.log(`🔑 Admin credentials verified: ${adminUsername}`);
    }

    // 2. Seed Teacher (teacher@pgc.com / teacherpgc)
    const teacherUsername = 'teacher@pgc.com';
    const teacherPassword = 'teacherpgc';
    let teacherUser = await User.findOne({ username: teacherUsername });
    if (!teacherUser) {
      teacherUser = await User.create({
        username: teacherUsername,
        passwordHash: teacherPassword,
        role: 'teacher',
      });
      console.log(`👨‍🏫 Teacher credentials created: ${teacherUsername} | Password: ${teacherPassword}`);
    } else {
      teacherUser.passwordHash = teacherPassword;
      await teacherUser.save();
      console.log(`👨‍🏫 Teacher credentials verified: ${teacherUsername}`);
    }

    // Ensure linked Teacher document exists
    const teacherDoc = await Teacher.findOne({ userId: teacherUser._id });
    if (!teacherDoc) {
      await Teacher.create({
        userId: teacherUser._id,
        fullName: 'PGC Faculty Teacher',
        subject: 'Character & Growth Assessment',
      });
      console.log(`📋 Teacher Profile initialized for ${teacherUsername}`);
    }
  } catch (err) {
    console.error('⚠️ Default users seed failed:', err.message);
  }
};



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    await seedDefaultUsers();

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

