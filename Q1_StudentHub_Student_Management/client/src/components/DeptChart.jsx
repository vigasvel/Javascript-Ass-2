// Simple horizontal bar chart drawn with CSS widths
export default function DeptChart({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="panel">
      <h3>Students by Department</h3>
      {data.map((d) => (
        <div key={d.department} className="hbar">
          <span className="hl">{d.department}</span>
          <div className="track">
            <div className="fill" style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
          <span className="hv">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
