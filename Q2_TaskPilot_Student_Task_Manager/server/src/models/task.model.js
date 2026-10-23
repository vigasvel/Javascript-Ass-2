const { Schema, model } = require('mongoose');

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];

const TaskSchema = new Schema(
  {
    title: { type: String, required: [true, 'Task title is required'], trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 400, default: '' },
    subject: { type: String, trim: true, default: 'General' },
    priority: { type: String, enum: PRIORITIES, default: 'Medium' },
    status: { type: String, enum: STATUSES, default: 'Pending' },
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Record when a task was completed
TaskSchema.pre('save', function (next) {
  if (this.isModified('status')) this.completedAt = this.status === 'Completed' ? new Date() : undefined;
  next();
});

TaskSchema.statics.PRIORITIES = PRIORITIES;
TaskSchema.statics.STATUSES = STATUSES;

module.exports = model('Task', TaskSchema);
