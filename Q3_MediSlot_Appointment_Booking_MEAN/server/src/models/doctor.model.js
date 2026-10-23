const { Schema, model } = require('mongoose');

const DoctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    qualification: { type: String, default: 'MBBS' },
    experience: { type: Number, default: 1 }, // years
    room: { type: String, default: '' },
    fee: { type: Number, default: 300 },
    days: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }, // working days
    slots: { type: [String], default: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] }, // HH:mm
  },
  { timestamps: true }
);

module.exports = model('Doctor', DoctorSchema);
