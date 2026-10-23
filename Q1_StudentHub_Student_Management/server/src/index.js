require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./db/connection');
const Student = require('./models/student.model');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  next();
});

app.get('/api', (_req, res) =>
  res.json({
    name: 'StudentHub API',
    endpoints: ['GET /api/students', 'GET /api/students/stats', 'GET /api/students/:id', 'POST /api/students', 'PUT /api/students/:id', 'DELETE /api/students/:id'],
  })
);
app.use('/api/students', require('./routes/student.routes'));
app.use(errorHandler);

const PORT = process.env.PORT || 5011;
connect('vigasvel_studenthub').then(async () => {
  if (!(await Student.estimatedDocumentCount())) {
    await Student.insertMany(require('./sampleStudents'));
    console.log('First run -> sample students added');
  }
  app.listen(PORT, () => console.log(`StudentHub server → http://localhost:${PORT}`));
});
