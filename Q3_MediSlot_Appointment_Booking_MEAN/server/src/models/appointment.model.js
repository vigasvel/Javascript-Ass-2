const { Schema, model } = require('mongoose');

const AppointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, // YYYY-MM-DD
    time: { type: String, required: true, match: /^\d{2}:\d{2}$/ }, // HH:mm
    reason: { type: String, trim: true, maxlength: 200, default: '' },
    status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
    token: { type: Number }, // queue number for that doctor on that day
  },
  { timestamps: true }
);

module.exports = model('Appointment', AppointmentSchema);
