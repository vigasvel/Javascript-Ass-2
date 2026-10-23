require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./db/connection');
const Doctor = require('./models/doctor.model');
const Patient = require('./models/patient.model');

const app = express();
app.use(cors({ origin: 'http://localhost:4201' }));
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  next();
});

app.get('/api', (_req, res) => res.json({ name: 'MediSlot API', status: 'running' }));
app.use('/api/doctors', require('./routes/doctor.routes'));
app.use('/api/patients', require('./routes/patient.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5013;
connect('vigasvel_medislot').then(async () => {
  if (!(await Doctor.countDocuments())) {
    const { doctors, patients } = require('./sampleData');
    await Doctor.insertMany(doctors);
    for (const p of patients) await new Patient(p).save();
    console.log('First run -> sample doctors and patients added');
  }
  app.listen(PORT, () => console.log(`MediSlot server → http://localhost:${PORT}`));
});
