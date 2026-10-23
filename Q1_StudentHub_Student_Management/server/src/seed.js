// npm run seed -> wipe and reload sample students
require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('./db/connection');
const Student = require('./models/student.model');

connect('vigasvel_studenthub').then(async () => {
  await Student.deleteMany();
  await Student.insertMany(require('./sampleStudents'));
  console.log('Sample students inserted');
  await mongoose.disconnect();
  process.exit(0);
});
