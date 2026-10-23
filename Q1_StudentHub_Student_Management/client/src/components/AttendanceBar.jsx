export default function AttendanceBar({ value }) {
  const tone = value >= 85 ? 'good' : value >= 75 ? 'ok' : 'low';
  return (
    <div className="att">
      <div className="att-track">
        <div className={`att-fill ${tone}`} style={{ width: `${value}%` }} />
      </div>
      <span className={tone}>{value}%</span>
    </div>
  );
}
