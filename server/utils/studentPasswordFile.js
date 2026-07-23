// server/utils/studentPasswordFile.js
// Utility to sync student parent credentials into std-pgc-pswd.json in the project root
const fs = require('fs');
const path = require('path');
const Student = require('../models/Student');

// Path to std-pgc-pswd.json at the workspace root
const ROOT_FILE_PATH = path.resolve(__dirname, '../../std-pgc-pswd.json');

/**
 * Synchronizes all students and their parent credentials from MongoDB to std-pgc-pswd.json
 */
async function syncPasswordFile() {
  try {
    const students = await Student.find()
      .sort({ rollNumber: 1 })
      .select('studentName rollNumber boardRollNumber fatherName gender result9th class section category parentPassword createdAt')
      .lean();

    const fileRecords = students.map(s => ({
      studentName:     s.studentName,
      rollNumber:      s.rollNumber,
      boardRollNumber: s.boardRollNumber || 'N/A',
      fatherName:      s.fatherName,
      gender:          s.gender || 'Male',
      result9th:       s.result9th || 'N/A',
      class:           s.class || 'N/A',
      section:         s.section || 'N/A',
      category:        s.category || 'Others',
      parentUsername:  (s.rollNumber || '').toLowerCase(),
      parentPassword:  s.parentPassword || 'N/A',
      createdAt:       s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
    }));

    fs.writeFileSync(ROOT_FILE_PATH, JSON.stringify(fileRecords, null, 2), 'utf8');
    return fileRecords;
  } catch (err) {
    console.error('Failed to sync std-pgc-pswd.json:', err.message);
    return [];
  }
}

module.exports = { syncPasswordFile, ROOT_FILE_PATH };
