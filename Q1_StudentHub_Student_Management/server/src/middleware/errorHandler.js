// Central error handler - every route forwards errors here with next(err)
module.exports = (err, req, res, _next) => {
  console.error('⚠', err.message);
  if (err.code === 11000) return res.status(409).json({ message: 'Register number already exists' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.name === 'ValidationError') return res.status(422).json({ message: err.message });
  res.status(500).json({ message: 'Server error', detail: err.message });
};
