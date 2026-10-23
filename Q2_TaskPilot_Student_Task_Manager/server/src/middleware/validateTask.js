const Task = require('../models/task.model');

module.exports = (partial = false) => (req, res, next) => {
  const { title, priority, status, dueDate } = req.body;
  const errors = {};
  if ((!partial || title !== undefined) && (!title || !title.trim())) errors.title = 'Title is required';
  if (title && title.length > 80) errors.title = 'Title max 80 characters';
  if (priority !== undefined && !Task.PRIORITIES.includes(priority)) errors.priority = 'Priority must be Low, Medium or High';
  if (status !== undefined && !Task.STATUSES.includes(status)) errors.status = 'Invalid status';
  if (dueDate && isNaN(Date.parse(dueDate))) errors.dueDate = 'Invalid due date';
  if (Object.keys(errors).length) return res.status(422).json({ message: 'Validation failed', errors });
  next();
};
