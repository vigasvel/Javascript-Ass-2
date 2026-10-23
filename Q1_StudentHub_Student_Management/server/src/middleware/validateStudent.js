// Validates the request body before it reaches MongoDB.
// partial=true is used for PUT (update) where not every field is sent.
module.exports = (partial = false) => (req, res, next) => {
  const b = req.body;
  const errors = {};
  const need = (k) => !partial || b[k] !== undefined;

  if (need('regNo') && !/^\d{2}[A-Za-z]{2,4}\d{3}$/.test(b.regNo || '')) errors.regNo = 'Register number must be like 24CS241';
  if (need('fullName') && (!b.fullName || b.fullName.trim().length < 3)) errors.fullName = 'Name must have at least 3 letters';
  if (need('gender') && !['Male', 'Female', 'Other'].includes(b.gender)) errors.gender = 'Select a gender';
  if (need('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || '')) errors.email = 'Invalid email';
  if (need('department') && !b.department) errors.department = 'Department is required';
  if (b.attendance !== undefined && (isNaN(b.attendance) || b.attendance < 0 || b.attendance > 100))
    errors.attendance = 'Attendance must be 0–100';
  if (b.guardianPhone && !/^[6-9]\d{9}$/.test(b.guardianPhone)) errors.guardianPhone = 'Guardian phone must be 10 digits';

  if (Object.keys(errors).length) return res.status(422).json({ message: 'Validation failed', errors });
  next();
};
