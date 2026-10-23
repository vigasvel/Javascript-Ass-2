import { useEffect, useReducer, useRef } from 'react';

const initial = { title: '', description: '', subject: '', priority: 'Medium', status: 'Pending', dueDate: '' };

// useReducer keeps all form fields in one state object
function reducer(state, action) {
  switch (action.type) {
    case 'field':
      return { ...state, [action.name]: action.value };
    case 'load':
      return { ...initial, ...action.task, dueDate: action.task.dueDate ? action.task.dueDate.slice(0, 10) : '' };
    case 'reset':
      return initial;
    default:
      return state;
  }
}

export default function TaskForm({ editing, subjects, onSave, onCancel }) {
  const [form, dispatch] = useReducer(reducer, initial);
  const titleRef = useRef(null); // useRef -> focus the title box

  useEffect(() => {
    dispatch(editing ? { type: 'load', task: editing } : { type: 'reset' });
    titleRef.current?.focus();
  }, [editing]);

  const change = (e) => dispatch({ type: 'field', name: e.target.name, value: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      subject: form.subject.trim() || 'General',
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
    });
    if (ok) dispatch({ type: 'reset' });
  };

  return (
    <form className="composer" onSubmit={submit}>
      <h2>{editing ? '✎ Edit task' : '＋ New task'}</h2>
      <input ref={titleRef} name="title" value={form.title} onChange={change} placeholder="What needs to be done?" maxLength={80} required />
      <textarea name="description" value={form.description} onChange={change} rows={3} placeholder="Details (optional)" />
      <input name="subject" value={form.subject} onChange={change} placeholder="Subject (e.g. Compiler Design)" list="subjects" />
      <datalist id="subjects">
        {subjects.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <span className="lbl">Priority</span>
      <div className="seg">
        {['Low', 'Medium', 'High'].map((p) => (
          <button type="button" key={p} className={`p-${p} ${form.priority === p ? 'sel' : ''}`} onClick={() => dispatch({ type: 'field', name: 'priority', value: p })}>
            {p}
          </button>
        ))}
      </div>

      <div className="pair">
        <label>
          <span className="lbl">Status</span>
          <select name="status" value={form.status} onChange={change}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>
        <label>
          <span className="lbl">Due date</span>
          <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
        </label>
      </div>

      <div className="row">
        <button className="go">{editing ? 'Save' : 'Add task'}</button>
        {editing && (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
