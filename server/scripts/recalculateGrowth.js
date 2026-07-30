// server/scripts/recalculateGrowth.js
// Migration script to recalculate student growth index values based on new weights

const mongoose = require('mongoose');
const Student = require('../models/Student');
const Evaluation = require('../models/Evaluation');
const { computeScore } = require('../services/growthEngine');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pgc_sgcms';

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to database.');

  const students = await Student.find({});
  console.log(`Found ${students.length} students. Starting recalculation...`);

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    
    // Get evaluations sorted by createdAt ascending (chronological order)
    const evaluations = await Evaluation.find({ studentId: student._id }).sort({ createdAt: 1 });
    
    if (evaluations.length === 0) {
      student.growthIndex = 0;
      student.growthTrendEMA = 0;
      student.evaluationCount = 0;
      await student.save();
      continue;
    }

    let runningGrowthIndex = 0;
    let runningEMA = 0;
    let runningCount = 0;

    for (let j = 0; j < evaluations.length; j++) {
      const evalDoc = evaluations[j];
      const newScore = computeScore(evalDoc);

      runningCount++;
      runningGrowthIndex = runningGrowthIndex + (newScore - runningGrowthIndex) / runningCount;
      runningEMA = runningCount === 1
        ? newScore
        : 0.25 * newScore + 0.75 * runningEMA;

      // Update snapshot on evaluation
      evalDoc.growthIndexAtSubmit = parseFloat(newScore.toFixed(2));
      await evalDoc.save();
    }

    student.growthIndex = parseFloat(runningGrowthIndex.toFixed(2));
    student.growthTrendEMA = parseFloat(runningEMA.toFixed(2));
    student.evaluationCount = runningCount;
    await student.save();

    console.log(`[${i + 1}/${students.length}] Recalculated ${student.studentName} (${student.rollNumber}): Count=${runningCount}, GrowthIndex=${student.growthIndex}, EMA=${student.growthTrendEMA}`);
  }

  console.log('Recalculation complete! Closing connection...');
  await mongoose.disconnect();
  console.log('Connection closed.');
}

main().catch(err => {
  console.error('Error during recalculation:', err);
  process.exit(1);
});
