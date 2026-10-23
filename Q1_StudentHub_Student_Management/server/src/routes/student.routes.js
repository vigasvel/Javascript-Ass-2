const router = require('express').Router();
const Student = require('../models/student.model');
const validate = require('../middleware/validateStudent');

// small helper so async errors go to errorHandler
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

/* ------------------------------------------------------------------
   GET /api/students/stats   -> dashboard numbers
------------------------------------------------------------------- */
router.get(
  '/stats',
  wrap(async (req, res) => {
    const all = await Student.find({}, 'department attendance gender hosteller');
    const byDept = {};
    all.forEach((s) => (byDept[s.department] = (byDept[s.department] || 0) + 1));
    const avg = all.length ? all.reduce((a, s) => a + s.attendance, 0) / all.length : 0;
    res.json({
      total: all.length,
      averageAttendance: Math.round(avg * 10) / 10,
      shortage: all.filter((s) => s.attendance < 75).length,
      hostellers: all.filter((s) => s.hosteller).length,
      byDepartment: Object.entries(byDept).map(([department, count]) => ({ department, count })),
    });
  })
);

/* GET /api/students?q=&department=&section=&shortage=true */
router.get(
  '/',
  wrap(async (req, res) => {
    const { q, department, section, shortage } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (section) filter.section = section;
    if (shortage === 'true') filter.attendance = { $lt: 75 };
    if (q) filter.$or = ['regNo', 'fullName', 'guardianName'].map((f) => ({ [f]: new RegExp(q, 'i') }));
    res.json(await Student.find(filter).sort({ regNo: 1 }));
  })
);

/* GET /api/students/:id */
router.get(
  '/:id',
  wrap(async (req, res) => {
    const s = await Student.findById(req.params.id);
    s ? res.json(s) : res.status(404).json({ message: 'Student not found' });
  })
);

/* POST /api/students  -> add */
router.post(
  '/',
  validate(),
  wrap(async (req, res) => {
    const created = await Student.create(req.body);
    res.status(201).json(created);
  })
);

/* PUT /api/students/:id  -> update */
router.put(
  '/:id',
  validate(true),
  wrap(async (req, res) => {
    delete req.body.regNo; // register number cannot be changed
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    s ? res.json(s) : res.status(404).json({ message: 'Student not found' });
  })
);

/* DELETE /api/students/:id */
router.delete(
  '/:id',
  wrap(async (req, res) => {
    const s = await Student.findByIdAndDelete(req.params.id);
    s ? res.json({ message: `${s.fullName} removed`, id: s._id }) : res.status(404).json({ message: 'Student not found' });
  })
);

module.exports = router;
