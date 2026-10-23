const router = require('express').Router();
const Doctor = require('../models/doctor.model');
const Appointment = require('../models/appointment.model');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// GET /api/doctors?specialization=
router.get(
  '/',
  wrap(async (req, res) => {
    const filter = req.query.specialization ? { specialization: req.query.specialization } : {};
    res.json(await Doctor.find(filter).sort({ specialization: 1, name: 1 }));
  })
);

// GET /api/doctors/:id/slots?date=YYYY-MM-DD -> every slot with available true/false
router.get(
  '/:id/slots',
  wrap(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    const date = req.query.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return res.status(400).json({ message: 'date must be YYYY-MM-DD' });

    const weekday = DAY[new Date(`${date}T00:00:00`).getDay()];
    const working = doctor.days.includes(weekday);
    const booked = await Appointment.find({ doctor: doctor._id, date, status: 'Booked' }, 'time');
    const taken = new Set(booked.map((a) => a.time));

    const now = new Date();
    const slots = doctor.slots.map((time) => {
      const past = new Date(`${date}T${time}:00`) < now;
      return { time, available: working && !past && !taken.has(time), booked: taken.has(time), past };
    });
    res.json({ doctor: doctor.name, date, weekday, working, slots });
  })
);

// POST /api/doctors (admin)
router.post(
  '/',
  wrap(async (req, res) => res.status(201).json(await Doctor.create(req.body)))
);

module.exports = router;
