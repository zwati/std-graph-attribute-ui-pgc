// server/scripts/importExcelStudents.js
// Parses the 2 Excel files in data/ directory and imports all real students with full details
const fs       = require('fs');
const path     = require('path');
const XLSX     = require('xlsx');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const Student    = require('../models/Student');
const Evaluation = require('../models/Evaluation');
const Class      = require('../models/Class');
const User       = require('../models/User');

const { computeScore, updateGrowth } = require('../services/growthEngine');
const { syncPasswordFile }           = require('../utils/studentPasswordFile');

const MONGO_URI_PRIMARY = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pgc_sgcms';
const MONGO_URI_LEGACY  = 'mongodb://127.0.0.1:27017/pgc-sgcms';
const DATA_DIR          = path.resolve(__dirname, '../../data');

function parseExcelFile(filePath, gender) {
  const wb = XLSX.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const students = [];
  let currentCategory = 'Medical';
  let currentSection = 'Pre-Med';

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rowText = row.map(c => String(c || '')).join(' ').trim();

    // Check if this row is a stream / category header (e.g. F.Sc.Pre-Medical, F.Sc.Pre-Engineering, ICS Phy, ICS)
    if (rowText.includes('Pre-Medical') || rowText.includes('Medical') || rowText.includes('Pre-Med')) {
      currentCategory = 'Medical';
      currentSection  = 'Pre-Med';
      continue;
    } else if (rowText.includes('Pre-Engineering') || rowText.includes('Engineering') || rowText.includes('Pre-Eng')) {
      currentCategory = 'Pre-Eng';
      currentSection  = 'Pre-Eng';
      continue;
    } else if (rowText.includes('ICS Phy') || rowText.includes('ICS  Phy') || rowText.includes('Phy')) {
      currentCategory = 'ICS';
      currentSection  = 'ICS Phy';
      continue;
    } else if (rowText.includes('ICS')) {
      currentCategory = 'ICS';
      currentSection  = 'ICS';
      continue;
    }



    // Skip title or header rows
    if (rowText.includes('Punjab College') || rowText.includes('Sr.No') || rowText.includes('Result Part-I')) continue;



    // Check if this is a valid data row (e.g. [1, 2302, "MUHAMMAD ABDULLAH ARSHAD ", "ARSHAD HAMEED ", 524, 300598])
    if (typeof row[0] === 'number' || (!isNaN(parseInt(row[0])) && row[1] && row[2])) {
      const rollNumber      = String(row[1] || '').trim();
      const studentName     = String(row[2] || '').trim();
      const fatherName      = String(row[3] || '').trim();
      const result9th       = String(row[4] || '').trim();
      const boardRollNumber = String(row[5] || '').trim();

      if (rollNumber && studentName) {
        students.push({
          rollNumber,
          boardRollNumber,
          studentName,
          fatherName,
          result9th,
          gender,
          category:       currentCategory,
          section:        currentSection,
          class:          '1st Year',
          customId:       rollNumber,
          parentPassword: `PGC@${rollNumber}`,
        });

      }
    }
  }

  return students;
}

async function runImport() {
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
    console.log('🗑 Purging all existing student, evaluation, class, and parent user records...');
    await Student.deleteMany({});
    await Evaluation.deleteMany({});
    await Class.deleteMany({});
    await User.deleteMany({ role: 'parent' });

    // Locate Excel Files
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));
    console.log(`📁 Found ${files.length} Excel files in data directory:`, files);

    let allExtractedStudents = [];

    files.forEach(file => {
      const fullPath = path.join(DATA_DIR, file);
      const isBoys = file.toLowerCase().includes('boys');
      const gender = isBoys ? 'Male' : 'Female';
      const extracted = parseExcelFile(fullPath, gender);
      console.log(`📊 Extracted ${extracted.length} students from "${file}" (Gender: ${gender})`);
      allExtractedStudents = allExtractedStudents.concat(extracted);
    });

    console.log(`⚡ Total Real Excel Students Extracted: ${allExtractedStudents.length}`);

    // Create default Class sections in DB
    const categoriesSections = [
      { className: '1st Year', category: 'Medical', section: 'Pre-Med' },
      { className: '1st Year', category: 'Pre-Eng', section: 'Pre-Eng' },
      { className: '1st Year', category: 'ICS',     section: 'ICS' },
      { className: '1st Year', category: 'ICS',     section: 'ICS Phy' },
    ];
    await Class.insertMany(categoriesSections);
    console.log('📚 Created Class Section mappings for Pre-Med, Pre-Eng, ICS, and ICS Phy.');




    // Get or create Teacher User for evaluations
    let teacherUser = await User.findOne({ role: 'teacher' });
    if (!teacherUser) {
      const passwordHash = await bcrypt.hash('teacherpgc', 12);
      teacherUser = await User.create({ username: 'teacher@pgc.com', passwordHash, role: 'teacher' });
    }

    // Insert Real Students and parent User credentials
    let importedCount = 0;
    for (const sData of allExtractedStudents) {
      const rawPassword = sData.parentPassword;
      const passwordHash = await bcrypt.hash(rawPassword, 12);

      // Create student document
      const studentDoc = await Student.create({
        customId:        sData.customId,
        rollNumber:      sData.rollNumber,
        boardRollNumber: sData.boardRollNumber,
        studentName:     sData.studentName,
        fatherName:      sData.fatherName,
        result9th:       sData.result9th,
        gender:          sData.gender,
        class:           sData.class,
        section:         sData.section,
        category:        sData.category,
        parentPassword:  rawPassword,
      });

      // Create Parent User linked via rollNumber (College Roll No.)
      await User.create({
        username:     sData.rollNumber.toLowerCase(),
        passwordHash,
        role:         'parent',
        linkedId:     studentDoc._id,
      });

      // Student starts cleanly unrated (growthIndex = 0, evaluationCount = 0) until teacher submits evaluations
      importedCount++;
    }

    console.log(`✅ Successfully imported ${importedCount} real Excel students into pgc_sgcms as clean unrated profiles!`);


    // Sync std-pgc-pswd.json file in project root
    const synced = await syncPasswordFile();
    console.log(`📄 std-pgc-pswd.json updated with ${synced.length} real student parent credentials.`);

    console.log('🎉 Excel import completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

runImport();
