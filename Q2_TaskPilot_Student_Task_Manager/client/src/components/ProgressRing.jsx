export default function ProgressRing({ value }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width="86" height="86" viewBox="0 0 86 86" className="ring">
      <circle cx="43" cy="43" r={r} stroke="#2a3346" strokeWidth="9" fill="none" />
      <circle
        cx="43" cy="43" r={r} stroke="url(#g)" strokeWidth="9" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} transform="rotate(-90 43 43)"
      />
      <defs>
        <linearGradient id="g">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <text x="43" y="49" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">{value}%</text>
    </svg>
  );
}
