require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('./db/connection');
const Doctor = require('./models/doctor.model');
const Patient = require('./models/patient.model');
const Appointment = require('./models/appointment.model');
const { doctors, patients } = require('./sampleData');

connect('vigasvel_medislot').then(async () => {
  await Promise.all([Doctor.deleteMany(), Patient.deleteMany(), Appointment.deleteMany()]);
  await Doctor.insertMany(doctors);
  for (const p of patients) await new Patient(p).save(); // save() so ids are generated
  console.log('Doctors and patients seeded');
  await mongoose.disconnect();
  process.exit(0);
});
