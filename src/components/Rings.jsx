// טבעות התקדמות קונצנטריות בסגנון Apple Watch. ring.dim מחשיך טבעת שלא נבחרה.
export default function Rings({ rings, size = 230, stroke = 17, gap = 6 }) {
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="טבעות התקדמות יומיות">
      {rings.map((ring, i) => {
        const r = center - stroke / 2 - i * (stroke + gap);
        const circ = 2 * Math.PI * r;
        const pct = ring.goal > 0 ? ring.value / ring.goal : 0;
        const shown = Math.min(pct, 1);
        return (
          <g key={ring.label} transform={`rotate(-90 ${center} ${center})`} style={{ opacity: ring.dim ? 0.28 : 1, transition: 'opacity .3s' }}>
            <circle cx={center} cy={center} r={r} fill="none" stroke={ring.color} strokeOpacity=".16" strokeWidth={stroke} />
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={ring.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - shown)}
              style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }}
            />
          </g>
        );
      })}
    </svg>
  );
}
