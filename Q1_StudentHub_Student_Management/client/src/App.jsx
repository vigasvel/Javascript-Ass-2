import { useMemo, useState } from 'react';
import useStudents from './hooks/useStudents';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import DeptChart from './components/DeptChart';
import StudentRows from './components/StudentRows';
import StudentModal from './components/StudentModal';

export default function App() {
  const [page, setPage] = useState('students');
  const [q, setQ] = useState('');
  const [department, setDepartment] = useState('');
  const [shortage, setShortage] = useState(false);
  const filters = useMemo(() => ({ q, department, shortage: shortage ? 'true' : '' }), [q, department, shortage]);

  const { students, stats, busy, addStudent, updateStudent, deleteStudent } = useStudents(filters);
  const [modal, setModal] = useState({ open: false, student: null });
  const [note, setNote] = useState('');

  const flash = (t) => {
    setNote(t);
    setTimeout(() => setNote(''), 2500);
  };

  const save = async (data) => {
    if (modal.student) {
      await updateStudent(modal.student._id, data);
      flash(`${data.fullName} updated`);
    } else {
      await addStudent(data);
      flash(`${data.fullName} added`);
    }
  };

  const remove = async (s) => {
    if (!confirm(`Remove ${s.fullName} (${s.regNo})?`)) return;
    try {
      flash(await deleteStudent(s._id));
    } catch (e) {
      flash(e.message);
    }
  };

  return (
    <div className="shell">
      <Sidebar page={page} setPage={setPage} onAdd={() => setModal({ open: true, student: null })} />
      <section className="content">
        <header className="head">
          <div>
            <h1>{page === 'dashboard' ? 'Dashboard' : 'Student Records'}</h1>
            <p>MERN Student Management System</p>
          </div>
          {busy && <span className="sync">syncing…</span>}
        </header>

        <StatCards stats={stats} />

        {page === 'dashboard' ? (
          <div className="dash">
            <DeptChart data={stats?.byDepartment} />
            <div className="panel">
              <h3>Attendance shortage (&lt; 75%)</h3>
              <StudentRows compact students={students.filter((s) => s.attendance < 75)} />
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="tools">
              <input placeholder="🔍 Search reg no, name, guardian" value={q} onChange={(e) => setQ(e.target.value)} />
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">All departments</option>
                {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS', 'CSBS'].map((d) => <option key={d}>{d}</option>)}
              </select>
              <label><input type="checkbox" checked={shortage} onChange={(e) => setShortage(e.target.checked)} /> Shortage only</label>
            </div>
            <StudentRows students={students} onEdit={(s) => setModal({ open: true, student: s })} onDelete={remove} />
          </div>
        )}
      </section>

      {modal.open && (
        <StudentModal
          key={modal.student?._id || 'new'}
          student={modal.student}
          onClose={() => setModal({ open: false, student: null })}
          onSubmit={save}
        />
      )}
      {note && <div className="note">{note}</div>}
    </div>
  );
}
