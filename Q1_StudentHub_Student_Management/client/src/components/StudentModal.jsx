import { useState } from 'react';

const DEPTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS', 'CSBS'];
const START = {
  regNo: '', fullName: '', gender: '', email: '', department: 'CSE', section: 'A',
  attendance: 100, guardianName: '', guardianPhone: '', hosteller: false,
};

// Add / Edit form shown as a modal dialog.
// The parent mounts it only while open, so the initial state is set once here.
export default function StudentModal({ student, onClose, onSubmit }) {
  const [data, setData] = useState(() => (student ? { ...START, ...student } : START));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setData((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!data.gender) return setError('Please choose a gender');
    setSaving(true);
    try {
      const { _id, id, eligible, createdAt, updatedAt, __v, ...body } = data;
      await onSubmit({ ...body, regNo: body.regNo.toUpperCase(), attendance: Number(body.attendance) });
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h2>{student ? 'Update Student' : 'Register New Student'}</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <div className="fgrid">
          <label>Register No*<input name="regNo" value={data.regNo} onChange={set} disabled={!!student} required placeholder="24CS241" /></label>
          <label>Full Name*<input name="fullName" value={data.fullName} onChange={set} required placeholder="Vigasvel R" /></label>
          <label>Email*<input type="email" name="email" value={data.email} onChange={set} required /></label>
          <fieldset>
            <legend>Gender*</legend>
            {['Male', 'Female', 'Other'].map((g) => (
              <label key={g} className="radio">
                <input type="radio" name="gender" value={g} checked={data.gender === g} onChange={set} /> {g}
              </label>
            ))}
          </fieldset>
          <label>Department
            <select name="department" value={data.department} onChange={set}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select>
          </label>
          <label>Section
            <select name="section" value={data.section} onChange={set}>{['A', 'B', 'C', 'D'].map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="span2">Attendance: <b>{data.attendance}%</b>
            <input type="range" name="attendance" min="0" max="100" value={data.attendance} onChange={set} />
          </label>
          <label>Guardian Name<input name="guardianName" value={data.guardianName} onChange={set} /></label>
          <label>Guardian Phone<input name="guardianPhone" value={data.guardianPhone} onChange={set} placeholder="10 digits" /></label>
          <label className="radio span2"><input type="checkbox" name="hosteller" checked={data.hosteller} onChange={set} /> Hosteller</label>
        </div>

        {error && <p className="form-error">{error}</p>}
        <div className="modal-foot">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="primary" disabled={saving}>{saving ? 'Saving…' : student ? 'Save Changes' : 'Add Student'}</button>
        </div>
      </form>
    </div>
  );
}
