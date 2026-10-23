module.exports = (err, _req, res, _next) => {
  console.error('⚠', err.message);
  if (err.code === 11000) return res.status(409).json({ message: 'Record already exists' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.name === 'ValidationError') {
    return res.status(422).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  res.status(500).json({ message: 'Server error', detail: err.message });
};
