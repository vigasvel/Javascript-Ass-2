const router = require('express').Router();
const Patient = require('../models/patient.model');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// GET /api/patients?search=   (name, phone or patient id)
router.get(
  '/',
  wrap(async (req, res) => {
    const s = (req.query.search || '').trim();
    const filter = s ? { $or: [{ name: new RegExp(s, 'i') }, { phone: new RegExp(s) }, { patientId: new RegExp(s, 'i') }] } : {};
    res.json(await Patient.find(filter).sort({ createdAt: -1 }).limit(50));
  })
);

// GET /api/patients/:patientId  (e.g. MS-1001)
router.get(
  '/:patientId',
  wrap(async (req, res) => {
    const p = await Patient.findOne({ patientId: req.params.patientId.toUpperCase() });
    p ? res.json(p) : res.status(404).json({ message: 'Patient not found' });
  })
);

// POST /api/patients -> register a patient
router.post(
  '/',
  wrap(async (req, res) => {
    const exists = await Patient.findOne({ phone: req.body.phone, name: new RegExp(`^${(req.body.name || '').trim()}$`, 'i') });
    if (exists) return res.status(409).json({ message: `Already registered as ${exists.patientId}`, patient: exists });
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  })
);

// PUT /api/patients/:patientId -> update details
router.put(
  '/:patientId',
  wrap(async (req, res) => {
    delete req.body.patientId;
    const p = await Patient.findOneAndUpdate({ patientId: req.params.patientId }, req.body, { new: true, runValidators: true });
    p ? res.json(p) : res.status(404).json({ message: 'Patient not found' });
  })
);

module.exports = router;
