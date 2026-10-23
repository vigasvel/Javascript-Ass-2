const router = require('express').Router();
const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// GET /api/appointments?patientId=&doctorId=&date=&status=
router.get(
  '/',
  wrap(async (req, res) => {
    const { patientId, doctorId, date, status } = req.query;
    const filter = {};
    if (patientId) {
      const p = await Patient.findOne({ patientId: patientId.toUpperCase() });
      if (!p) return res.json([]);
      filter.patient = p._id;
    }
    if (doctorId) filter.doctor = doctorId;
    if (date) filter.date = date;
    if (status) filter.status = status;
    const list = await Appointment.find(filter).populate('patient').populate('doctor').sort({ date: 1, time: 1 });
    res.json(list);
  })
);

// POST /api/appointments -> book a slot
router.post(
  '/',
  wrap(async (req, res) => {
    const { patientId, doctorId, date, time, reason } = req.body;
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ message: 'patientId, doctorId, date and time are required' });
    }
    const patient = await Patient.findOne({ patientId: String(patientId).toUpperCase() });
    if (!patient) return res.status(404).json({ message: 'Patient not registered' });
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (!doctor.slots.includes(time)) return res.status(400).json({ message: 'Invalid slot for this doctor' });
    if (!doctor.days.includes(DAY[new Date(`${date}T00:00:00`).getDay()])) {
      return res.status(400).json({ message: `${doctor.name} is not available on this day` });
    }
    if (new Date(`${date}T${time}:00`) < new Date()) return res.status(400).json({ message: 'Cannot book a past slot' });

    // double-booking checks
    if (await Appointment.findOne({ doctor: doctor._id, date, time, status: 'Booked' })) {
      return res.status(409).json({ message: 'Sorry, this slot was just booked. Pick another time.' });
    }
    if (await Appointment.findOne({ patient: patient._id, date, time, status: 'Booked' })) {
      return res.status(409).json({ message: 'Patient already has an appointment at this time' });
    }

    const token = (await Appointment.countDocuments({ doctor: doctor._id, date })) + 1;
    const appt = await Appointment.create({ patient: patient._id, doctor: doctor._id, date, time, reason, token });
    res.status(201).json(await appt.populate(['patient', 'doctor']));
  })
);

// PATCH /api/appointments/:id/status  body {status: 'Cancelled' | 'Completed'}
router.patch(
  '/:id/status',
  wrap(async (req, res) => {
    const { status } = req.body;
    if (!['Cancelled', 'Completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (appt.status !== 'Booked') return res.status(400).json({ message: `Appointment is already ${appt.status}` });
    appt.status = status;
    await appt.save();
    res.json(await appt.populate(['patient', 'doctor']));
  })
);

// DELETE /api/appointments/:id
router.delete(
  '/:id',
  wrap(async (req, res) => {
    const a = await Appointment.findByIdAndDelete(req.params.id);
    a ? res.json({ message: 'Appointment deleted' }) : res.status(404).json({ message: 'Appointment not found' });
  })
);

module.exports = router;
