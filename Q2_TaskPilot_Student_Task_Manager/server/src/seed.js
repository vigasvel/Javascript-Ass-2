require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('./db/connection');
const Task = require('./models/task.model');

connect('vigasvel_taskpilot').then(async () => {
  await Task.deleteMany();
  for (const t of require('./sampleTasks')) await Task.create(t);
  console.log('Sample tasks inserted');
  await mongoose.disconnect();
  process.exit(0);
});
