const ITEMS = [
  { id: 'dashboard', icon: '▦', label: 'Dashboard' },
  { id: 'students', icon: '☰', label: 'Students' },
];

export default function Sidebar({ page, setPage, onAdd }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span>S</span>
        <div>
          StudentHub
          <small>KPRIET · CSE</small>
        </div>
      </div>
      {ITEMS.map((i) => (
        <button key={i.id} className={page === i.id ? 'nav on' : 'nav'} onClick={() => setPage(i.id)}>
          <i>{i.icon}</i> {i.label}
        </button>
      ))}
      <button className="add" onClick={onAdd}>
        + New Student
      </button>
      <p className="by">
        Vigasvel R<br />
        24CS241
      </p>
    </aside>
  );
}
