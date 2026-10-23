export default function StatCards({ stats }) {
  if (!stats) return null;
  const cards = [
    { label: 'Total Students', value: stats.total, tone: 'blue' },
    { label: 'Avg Attendance', value: `${stats.averageAttendance}%`, tone: 'green' },
    { label: 'Below 75%', value: stats.shortage, tone: 'red' },
    { label: 'Hostellers', value: stats.hostellers, tone: 'orange' },
  ];
  return (
    <div className="stat-row">
      {cards.map((c) => (
        <div key={c.label} className={`stat ${c.tone}`}>
          <span>{c.label}</span>
          <b>{c.value}</b>
        </div>
      ))}
    </div>
  );
}
