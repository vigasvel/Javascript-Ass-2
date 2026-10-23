import { useMemo, useState } from 'react';
import useTasks from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import Board from './components/Board';
import ProgressRing from './components/ProgressRing';

export default function App() {
  const { tasks, subjects, stats, loading, error, addTask, editTask, moveTask, deleteTask, clearCompleted } = useTasks();
  const [editing, setEditing] = useState(null);
  const [priority, setPriority] = useState('All');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const say = (text, bad) => {
    setToast({ text, bad });
    setTimeout(() => setToast(null), 2500);
  };

  const visible = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (priority === 'All' || t.priority === priority) &&
          (!subject || t.subject === subject) &&
          (!search || t.title.toLowerCase().includes(search.toLowerCase()))
      ),
    [tasks, priority, subject, search]
  );

  const save = async (data) => {
    try {
      if (editing) {
        await editTask(editing._id, data);
        say('Task updated');
        setEditing(null);
      } else {
        await addTask(data);
        say('Task added');
      }
      return true;
    } catch (e) {
      say(e.message, true);
      return false;
    }
  };

  const handlers = {
    onMove: async (t, status) => {
      await moveTask(t._id, status);
      say(`"${t.title}" → ${status}`);
    },
    onEdit: setEditing,
    onDelete: async (t) => {
      if (confirm(`Delete "${t.title}"?`)) say((await deleteTask(t._id)).message);
    },
  };

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <div className="mark">✈</div>
          <div>
            <h1>TaskPilot</h1>
            <p>Student task manager · React Hooks + Node + MongoDB</p>
          </div>
        </div>
        <div className="kpis">
          <ProgressRing value={stats.progress} />
          <div className="kpi"><b>{stats.total}</b>Total</div>
          <div className="kpi"><b>{stats.done}</b>Done</div>
          <div className="kpi red"><b>{stats.overdue}</b>Overdue</div>
          <div className="kpi amber"><b>{stats.high}</b>High open</div>
        </div>
      </header>

      <div className="layout">
        <aside>
          <TaskForm editing={editing} subjects={subjects} onSave={save} onCancel={() => setEditing(null)} />
          <button className="clear" onClick={async () => say((await clearCompleted()).message)}>
            Clear completed tasks
          </button>
        </aside>

        <main>
          <div className="filters">
            <input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="seg small">
              {['All', 'High', 'Medium', 'Low'].map((p) => (
                <button key={p} className={priority === p ? 'sel' : ''} onClick={() => setPriority(p)}>{p}</button>
              ))}
            </div>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">All subjects</option>
              {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          {error && <p className="err">⚠ {error} – is the server running on port 5012?</p>}
          {loading ? <p className="empty">Loading…</p> : <Board tasks={visible} {...handlers} />}
        </main>
      </div>
      {toast && <div className={`toast ${toast.bad ? 'bad' : ''}`}>{toast.text}</div>}
      <footer>U21CSP12 · Assignment II · Vigasvel R (24CS241)</footer>
    </div>
  );
}
