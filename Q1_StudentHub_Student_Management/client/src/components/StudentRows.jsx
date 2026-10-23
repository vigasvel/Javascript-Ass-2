import AttendanceBar from './AttendanceBar';

export default function StudentRows({ students, onEdit, onDelete, compact = false }) {
  if (!students.length) return <p className="none">No students found.</p>;
  return (
    <table className="grid">
      <thead>
        <tr>
          <th>Reg No</th>
          <th>Student</th>
          <th>Dept / Sec</th>
          <th>Attendance</th>
          {!compact && <th>Guardian</th>}
          {!compact && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s._id}>
            <td className="reg">{s.regNo}</td>
            <td>
              <div className="who">
                <span className={`av ${s.gender === 'Female' ? 'f' : 'm'}`}>{s.fullName[0]}</span>
                <div>
                  {s.fullName} {s.hosteller && <em className="tag">Hostel</em>}
                  <small>{s.email}</small>
                </div>
              </div>
            </td>
            <td>
              {s.department} – {s.section}
            </td>
            <td>
              <AttendanceBar value={s.attendance} />
              {!s.eligible && <small className="warn">Not eligible for exam</small>}
            </td>
            {!compact && (
              <td>
                {s.guardianName || '—'}
                <small>{s.guardianPhone}</small>
              </td>
            )}
            {!compact && (
              <td className="acts">
                <button onClick={() => onEdit(s)} title="Edit">✎ Edit</button>
                <button className="danger" onClick={() => onDelete(s)} title="Delete">🗑 Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
