const NEXT = { Pending: 'In Progress', 'In Progress': 'Completed', Completed: 'Pending' };

function dueLabel(task) {
  if (!task.dueDate) return null;
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate).setHours(0, 0, 0, 0);
  const days = Math.round((due - today) / 864e5);
  if (task.status === 'Completed') return { text: `Due ${new Date(task.dueDate).toLocaleDateString('en-IN')}`, cls: '' };
  if (days < 0) return { text: `Overdue by ${-days} day(s)`, cls: 'late' };
  if (days === 0) return { text: 'Due today', cls: 'soon' };
  if (days <= 2) return { text: `Due in ${days} day(s)`, cls: 'soon' };
  return { text: `Due ${new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`, cls: '' };
}

export default function TaskCard({ task, onMove, onEdit, onDelete }) {
  const due = dueLabel(task);
  const done = task.status === 'Completed';
  return (
    <div className={`task pr-${task.priority} ${done ? 'done' : ''}`}>
      <div className="task-top">
        <label className="check">
          <input type="checkbox" checked={done} onChange={() => onMove(task, done ? 'Pending' : 'Completed')} />
          <span>{task.title}</span>
        </label>
        <span className={`prio ${task.priority}`}>{task.priority}</span>
      </div>
      {task.description && <p className="desc">{task.description}</p>}
      <div className="task-meta">
        <span className="subj">{task.subject}</span>
        {due && <span className={`due ${due.cls}`}>{due.text}</span>}
      </div>
      <div className="task-actions">
        <button onClick={() => onMove(task, NEXT[task.status])}>→ {NEXT[task.status]}</button>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="del" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  );
}
