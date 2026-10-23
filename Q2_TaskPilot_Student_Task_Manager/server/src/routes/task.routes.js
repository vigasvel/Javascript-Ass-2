const router = require('express').Router();
const Task = require('../models/task.model');
const validate = require('../middleware/validateTask');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

// GET /api/tasks?status=&priority=&subject=&q=
router.get(
  '/',
  wrap(async (req, res) => {
    const { status, priority, subject, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (subject) filter.subject = subject;
    if (q) filter.title = new RegExp(q, 'i');
    const tasks = await Task.find(filter).lean();
    // sort: High priority first, then nearest due date
    tasks.sort(
      (a, b) =>
        PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
        (a.dueDate ? new Date(a.dueDate) : Infinity) - (b.dueDate ? new Date(b.dueDate) : Infinity)
    );
    res.json(tasks);
  })
);

// GET /api/tasks/subjects -> list for the filter dropdown
router.get(
  '/subjects',
  wrap(async (_req, res) => res.json((await Task.distinct('subject')).sort()))
);

// POST /api/tasks -> add task
router.post(
  '/',
  validate(),
  wrap(async (req, res) => res.status(201).json(await Task.create(req.body)))
);

// PUT /api/tasks/:id -> edit task
router.put(
  '/:id',
  validate(true),
  wrap(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  })
);

// PATCH /api/tasks/:id/status -> quick status change from the board
router.patch(
  '/:id/status',
  validate(true),
  wrap(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = req.body.status;
    await task.save();
    res.json(task);
  })
);

// DELETE /api/tasks/:id
router.delete(
  '/:id',
  wrap(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: `Deleted "${task.title}"` });
  })
);

// DELETE /api/tasks?status=Completed -> clear finished tasks
router.delete(
  '/',
  wrap(async (req, res) => {
    if (req.query.status !== 'Completed') return res.status(400).json({ message: 'Only completed tasks can be cleared' });
    const r = await Task.deleteMany({ status: 'Completed' });
    res.json({ message: `Cleared ${r.deletedCount} completed task(s)` });
  })
);

module.exports = router;
