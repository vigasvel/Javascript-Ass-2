require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./db/connection');
const Task = require('./models/task.model');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  next();
});

app.get('/api', (_req, res) => res.json({ name: 'TaskPilot API', status: 'running' }));
app.use('/api/tasks', require('./routes/task.routes'));
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5012;
connect('vigasvel_taskpilot').then(async () => {
  if (!(await Task.countDocuments())) {
    for (const t of require('./sampleTasks')) await Task.create(t);
    console.log('First run -> sample tasks added');
  }
  app.listen(PORT, () => console.log(`TaskPilot server → http://localhost:${PORT}`));
});
