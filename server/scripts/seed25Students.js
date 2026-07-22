// server/scripts/seed25Students.js
// Drops legacy database, resets collections, and seeds 25 realistic students with full evaluation history
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Student  = require('../models/Student');
const Evaluation = require('../models/Evaluation');
const Class    = require('../models/Class');
const User     = require('../models/User');
const Teacher  = require('../models/Teacher');
const { computeScore, updateGrowth } = require('../services/growthEngine');
const { syncPasswordFile } = require('../utils/studentPasswordFile');

const MONGO_URI_PRIMARY = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pgc_sgcms';
const MONGO_URI_LEGACY  = 'mongodb://127.0.0.1:27017/pgc-sgcms';

const SEED_CLASSES = [
  { className: '1st Year', category: 'Medical',         section: 'Med-1' },
  { className: '2nd Year', category: 'Medical',         section: 'Med-2' },
  { className: '1st Year', category: 'Pre-Engineering', section: 'Eng-1' },
  { className: '2nd Year', category: 'Pre-Engineering', section: 'Eng-2' },
  { className: '1st Year', category: 'ICS',             section: 'ICS-A' },
  { className: '2nd Year', category: 'ICS',             section: 'ICS-B' },
  { className: 'FA23',     category: 'Others',          section: 'FA-1'  },
];

const SEED_STUDENTS = [
  // Medical
  { rollNumber: '1001', customId: 'PGC-2026-101', studentName: 'Chaudhry Muhammad Zaid', fatherName: 'Chaudhry Rashid Ahmad', class: '1st Year', section: 'Med-1', category: 'Medical', parentPassword: 'PGC@1001' },
  { rollNumber: '1002', customId: 'PGC-2026-102', studentName: 'Muhammad Wahab',         fatherName: 'Tariq Mehmood',        class: '1st Year', section: 'Med-1', category: 'Medical', parentPassword: 'PGC@1002' },
  { rollNumber: '1003', customId: 'PGC-2026-103', studentName: 'Syed Hamza Zafar',       fatherName: 'Zafar Iqbal Shah',     class: '1st Year', section: 'Med-1', category: 'Medical', parentPassword: 'PGC@1003' },
  { rollNumber: '1004', customId: 'PGC-2026-104', studentName: 'Ayesha Fatima',          fatherName: 'Dr. Usman Ghani',      class: '1st Year', section: 'Med-1', category: 'Medical', parentPassword: 'PGC@1004' },
  { rollNumber: '1005', customId: 'PGC-2026-105', studentName: 'Zainab Malik',           fatherName: 'Malik Jahangir',       class: '2nd Year', section: 'Med-2', category: 'Medical', parentPassword: 'PGC@1005' },
  { rollNumber: '1006', customId: 'PGC-2026-106', studentName: 'Usman Ali Khan',         fatherName: 'Sardar Asad Khan',     class: '2nd Year', section: 'Med-2', category: 'Medical', parentPassword: 'PGC@1006' },
  { rollNumber: '1007', customId: 'PGC-2026-107', studentName: 'Maryam Siddiqui',        fatherName: 'Siddique Akbar',       class: '2nd Year', section: 'Med-2', category: 'Medical', parentPassword: 'PGC@1007' },

  // Pre-Engineering
  { rollNumber: '1008', customId: 'PGC-2026-108', studentName: 'Bilal Hassan Mirza',     fatherName: 'Mirza Hassan Baig',    class: '1st Year', section: 'Eng-1', category: 'Pre-Engineering', parentPassword: 'PGC@1008' },
  { rollNumber: '1009', customId: 'PGC-2026-109', studentName: 'Abdullah Javaid',        fatherName: 'Javaid Akhtar',        class: '1st Year', section: 'Eng-1', category: 'Pre-Engineering', parentPassword: 'PGC@1009' },
  { rollNumber: '1010', customId: 'PGC-2026-110', studentName: 'Omer Farooq',            fatherName: 'Farooq Azam',          class: '1st Year', section: 'Eng-1', category: 'Pre-Engineering', parentPassword: 'PGC@1010' },
  { rollNumber: '1011', customId: 'PGC-2026-111', studentName: 'Saad Ahmed Qureshi',     fatherName: 'Qureshi Nisar Ahmed',  class: '2nd Year', section: 'Eng-2', category: 'Pre-Engineering', parentPassword: 'PGC@1011' },
  { rollNumber: '1012', customId: 'PGC-2026-112', studentName: 'Khadija Rehman',         fatherName: 'Shafiq ur Rehman',     class: '2nd Year', section: 'Eng-2', category: 'Pre-Engineering', parentPassword: 'PGC@1012' },
  { rollNumber: '1013', customId: 'PGC-2026-113', studentName: 'Rayyan Mustafa',         fatherName: 'Ghulam Mustafa',       class: '2nd Year', section: 'Eng-2', category: 'Pre-Engineering', parentPassword: 'PGC@1013' },

  // ICS
  { rollNumber: '1014', customId: 'PGC-2026-114', studentName: 'Hassan Raza',            fatherName: 'Raza Ali',             class: '1st Year', section: 'ICS-A', category: 'ICS', parentPassword: 'PGC@1014' },
  { rollNumber: '1015', customId: 'PGC-2026-115', studentName: 'Daniya Imran',           fatherName: 'Imran Ul Haq',         class: '1st Year', section: 'ICS-A', category: 'ICS', parentPassword: 'PGC@1015' },
  { rollNumber: '1016', customId: 'PGC-2026-116', studentName: 'Talha Mahmood',          fatherName: 'Mahmood Hassan',       class: '1st Year', section: 'ICS-A', category: 'ICS', parentPassword: 'PGC@1016' },
  { rollNumber: '1017', customId: 'PGC-2026-117', studentName: 'Subhan Saeed',           fatherName: 'Saeed Ahmad',          class: '2nd Year', section: 'ICS-B', category: 'ICS', parentPassword: 'PGC@1017' },
  { rollNumber: '1018', customId: 'PGC-2026-118', studentName: 'Laiba Naeem',            fatherName: 'Naeem Shahzad',        class: '2nd Year', section: 'ICS-B', category: 'ICS', parentPassword: 'PGC@1018' },
  { rollNumber: '1019', customId: 'PGC-2026-119', studentName: 'Shahzaib Tanveer',      fatherName: 'Tanveer Ashraf',       class: '2nd Year', section: 'ICS-B', category: 'ICS', parentPassword: 'PGC@1019' },

  // Others (FA23)
  { rollNumber: '1020', customId: 'PGC-2026-120', studentName: 'Eshal Fatimah',         fatherName: 'Faisal Mehmood',       class: 'FA23',     section: 'FA-1',  category: 'Others', parentPassword: 'PGC@1020' },
  { rollNumber: '1021', customId: 'PGC-2026-121', studentName: 'Fahad Nawaz',            fatherName: 'Haq Nawaz',            class: 'FA23',     section: 'FA-1',  category: 'Others', parentPassword: 'PGC@1021' },
  { rollNumber: '1022', customId: 'PGC-2026-122', studentName: 'Minahil Tariq',          fatherName: 'Tariq Javed',          class: 'FA23',     section: 'FA-1',  category: 'Others', parentPassword: 'PGC@1022' },
  { rollNumber: '1023', customId: 'PGC-2026-123', studentName: 'Zubair Bilal',           fatherName: 'Bilal Ahmad',          class: 'FA23',     section: 'FA-1',  category: 'Others', parentPassword: 'PGC@1023' },
  { rollNumber: '1024', customId: 'PGC-2026-124', studentName: 'Anaya Sohail',           fatherName: 'Sohail Anwar',         class: 'FA23',     section: 'FA-1',  category: 'Others', parentPassword: 'PGC@1024' },
  { rollNumber: '1025', customId: 'PGC-2026-125', studentName: 'Hamza Waseem',           fatherName: 'Waseem Akram',         class: 'FA23',     section: 'FA-1',  category: 'Others', parentPassword: 'PGC@1025' },
];

async function seed() {
  try {
    console.log('🧹 Cleaning up legacy database pgc-sgcms if exists...');
    try {
      const legacyConn = await mongoose.createConnection(MONGO_URI_LEGACY).asPromise();
      await legacyConn.dropDatabase();
      await legacyConn.close();
      console.log('✅ Legacy database pgc-sgcms dropped successfully.');
    } catch (e) {
      console.log('ℹ️ Legacy database pgc-sgcms drop skipped or clean.');
    }

    console.log('🔌 Connecting to primary database pgc_sgcms...');
    await mongoose.connect(MONGO_URI_PRIMARY);
    console.log('✅ Connected to MongoDB pgc_sgcms.');

    // Clear existing collections
    console.log('🗑 Clearing existing Student, Evaluation, Class, and Parent User records...');
    await Student.deleteMany({});
    await Evaluation.deleteMany({});
    await Class.deleteMany({});
    await User.deleteMany({ role: 'parent' });

    // Seed Classes
    console.log('📚 Seeding 7 Class & Section categories...');
    const createdClasses = await Class.insertMany(SEED_CLASSES);
    console.log(`✅ Created ${createdClasses.length} classes.`);

    // Find or create Teacher User for evaluation signing
    let teacherUser = await User.findOne({ role: 'teacher' });
    if (!teacherUser) {
      const passwordHash = await bcrypt.hash('teacherpgc', 12);
      teacherUser = await User.create({ username: 'teacher@pgc.com', passwordHash, role: 'teacher' });
    }

    console.log('👨‍🎓 Seeding 25 full student profiles and parent login credentials...');
    let seededCount = 0;

    for (const sData of SEED_STUDENTS) {
      const rawPassword = sData.parentPassword;
      const passwordHash = await bcrypt.hash(rawPassword, 12);

      // Create student document
      const studentDoc = await Student.create({
        customId:       sData.customId,
        rollNumber:     sData.rollNumber,
        studentName:    sData.studentName,
        fatherName:     sData.fatherName,
        class:          sData.class,
        section:        sData.section,
        category:       sData.category,
        parentPassword: rawPassword,
      });

      // Create parent User account
      await User.create({
        username:     sData.rollNumber.toLowerCase(),
        passwordHash,
        role:         'parent',
        linkedId:     studentDoc._id,
      });

      // Create 2–3 evaluation snapshots per student (Initial vs Re-evaluation for progress/loss trends)
      const months = ['2026-05', '2026-06', '2026-07'];

      // Generate realistic attribute scores (1–5)
      let baseAttrs = {
        communication:  Math.floor(Math.random() * 3) + 3, // 3-5
        discipline:     Math.floor(Math.random() * 3) + 3,
        leadership:     Math.floor(Math.random() * 3) + 3,
        participation:  Math.floor(Math.random() * 3) + 3,
        responsibility: Math.floor(Math.random() * 3) + 3,
        teamwork:       Math.floor(Math.random() * 3) + 3,
      };

      for (let i = 0; i < months.length; i++) {
        const month = months[i];

        // Slightly adjust scores over time to simulate progress or loss
        const variation = (i === 1) ? 1 : (i === 2) ? -1 : 0;
        const currentAttrs = {
          communication:  Math.min(5, Math.max(1, baseAttrs.communication + variation)),
          discipline:     Math.min(5, Math.max(1, baseAttrs.discipline + variation)),
          leadership:     Math.min(5, Math.max(1, baseAttrs.leadership + (variation > 0 ? 1 : 0))),
          participation:  Math.min(5, Math.max(1, baseAttrs.participation + variation)),
          responsibility: Math.min(5, Math.max(1, baseAttrs.responsibility + variation)),
          teamwork:       Math.min(5, Math.max(1, baseAttrs.teamwork + variation)),
        };

        const score = computeScore(currentAttrs);
        const growthUpdate = updateGrowth(studentDoc, score);
        await Student.updateOne({ _id: studentDoc._id }, { $set: growthUpdate });

        await Evaluation.create({
          studentId:           studentDoc._id,
          evaluatedBy:         teacherUser._id,
          ...currentAttrs,
          remarks:             i === 0 ? 'Initial baseline character evaluation.' : i === 1 ? 'Showed notable improvement in class participation and leadership.' : 'Slight decline in discipline, needs focus.',
          growthIndexAtSubmit: growthUpdate.growthIndex,
          month,
          createdAt:           new Date(`2026-0${i + 5}-15T10:00:00Z`),
        });
      }

      seededCount++;
    }

    console.log(`✅ Successfully seeded ${seededCount} students with evaluation history & parent accounts!`);

    // Sync std-pgc-pswd.json file
    const synced = await syncPasswordFile();
    console.log(`📄 std-pgc-pswd.json updated with ${synced.length} student parent credentials.`);

    console.log('🎉 Database cleanup and 25-student seeding completed cleanly!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
