import { useState } from 'react';
import { Droplets, Minus, Pencil, Plus, X } from 'lucide-react';
import GoalsForm from './GoalsForm';
import Rings from './Rings';
import { sumMacros, todayISO, useStore } from '../lib/store';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'לילה טוב';
  if (h < 12) return 'בוקר טוב';
  if (h < 17) return 'צהריים טובים';
  if (h < 21) return 'ערב טוב';
  return 'לילה טוב';
};

const COLORS = { cal: '#e2674f', p: '#4f86c6', c: '#e0a526', f: '#9a6aa6' };

export default function Dashboard({ goDiary }) {
  const { state, changeWater } = useStore();
  const [focus, setFocus] = useState('all'); // all | cal | p | c | f
  const [editGoals, setEditGoals] = useState(false);
  const today = todayISO();
  const { goals } = state;
  const t = sumMacros(state.entries.filter((e) => e.date === today));
  const glasses = state.water[today] || 0;

  const metrics = [
    { key: 'cal', label: 'קלוריות', value: t.cal, goal: goals.cal, unit: 'קק״ל' },
    { key: 'p', label: 'חלבון', value: t.p, goal: goals.p, unit: 'ג׳' },
    { key: 'c', label: 'פחמימות', value: t.c, goal: goals.c, unit: 'ג׳' },
    { key: 'f', label: 'שומנים', value: t.f, goal: goals.f, unit: 'ג׳' },
  ];
  const rings = metrics.map((m) => ({ ...m, label: m.label, color: COLORS[m.key], dim: focus !== 'all' && focus !== m.key }));

  // חלוקת הקלוריות שנאכלו לפי מאקרו (4/4/9)
  const kP = t.p * 4, kC = t.c * 4, kF = t.f * 9;
  const kTotal = kP + kC + kF;
  const share = (k) => (kTotal > 0 ? Math.round((k / kTotal) * 100) : 0);
  const split = [
    { key: 'p', label: 'חלבון', kcal: kP },
    { key: 'c', label: 'פחמימות', kcal: kC },
    { key: 'f', label: 'שומנים', kcal: kF },
  ];

  const current = metrics.find((m) => m.key === focus);
  const remaining = Math.round(goals.cal - t.cal);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between px-1">
        <div>
          <p className="text-[13px] text-ink/65">{new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="h-display text-[1.6rem] leading-tight">{greeting()}</h1>
        </div>
        <button onClick={() => setEditGoals(true)} className="btn-ghost !px-3.5 !py-2 text-[13px]">
          <Pencil size={15} /> עריכת יעדים
        </button>
      </header>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5" role="tablist" aria-label="בחירת מדד">
        {[{ key: 'all', label: 'הכול' }, ...metrics].map((m) => {
          const on = focus === m.key;
          return (
            <button
              key={m.key}
              role="tab"
              aria-selected={on}
              onClick={() => setFocus(m.key)}
              className={`shrink-0 rounded-md px-4 py-2 text-[13px] font-semibold transition ${on ? 'bg-ink text-paper' : 'bg-ink/[.06] text-ink/60'}`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <section className="card flex flex-col items-center !px-4 !py-7">
        <div className="relative">
          <Rings rings={rings} size={236} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {focus === 'all' ? (
              <>
                <span className="h-display tnum text-[2.4rem] leading-none">{Math.abs(remaining).toLocaleString('he-IL')}</span>
                <span className="mt-1.5 text-[12px] text-ink/65">{remaining >= 0 ? 'קק״ל נשארו להיום' : 'קק״ל מעל היעד'}</span>
              </>
            ) : (
              <>
                <span className="h-display tnum text-[2.4rem] leading-none" style={{ color: COLORS[focus] }}>
                  {Math.round(current.value)}
                </span>
                <span className="tnum mt-1.5 text-[12px] text-ink/65">
                  מתוך {current.goal} {current.unit}
                </span>
                <span className="mt-0.5 text-[12px] font-semibold">{current.label}</span>
              </>
            )}
          </div>
        </div>

        <ul className="mt-7 w-full space-y-4">
          {metrics.map((m) => {
            const pct = m.goal > 0 ? Math.min(100, (m.value / m.goal) * 100) : 0;
            return (
              <li key={m.key}>
                <button onClick={() => setFocus(focus === m.key ? 'all' : m.key)} className="block w-full text-start">
                  <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="h-2 w-2 rounded-md" style={{ background: COLORS[m.key] }} />
                      {m.label}
                    </span>
                    <span className="tnum text-ink/70">
                      <b className="font-semibold text-ink">{Math.round(m.value)}</b> / {m.goal} {m.unit}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-md bg-ink/[.06]">
                    <div className="h-full rounded-md transition-all duration-700" style={{ width: `${pct}%`, background: COLORS[m.key] }} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h2 className="h-display text-[15px]">חלוקת המאקרו היום</h2>
        <p className="mt-0.5 text-[12px] text-ink/60">מתוך הקלוריות שאכלת</p>
        <div className="mt-4 flex h-3 overflow-hidden rounded-md bg-ink/[.06]">
          {kTotal > 0 &&
            split.map((s) => <div key={s.key} style={{ width: `${(s.kcal / kTotal) * 100}%`, background: COLORS[s.key] }} />)}
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-3 text-center">
          {split.map((s) => (
            <li key={s.key}>
              <p className="h-display tnum text-xl" style={{ color: COLORS[s.key] }}>
                {share(s.kcal)}%
              </p>
              <p className="text-[12px] text-ink/65">{s.label}</p>
            </li>
          ))}
        </ul>
        {kTotal === 0 && <p className="mt-3 text-center text-[12px] text-ink/55">הוסף ארוחה כדי לראות את החלוקה.</p>}
      </section>

      <button onClick={goDiary} className="btn w-full !py-3.5">
        <Plus size={18} strokeWidth={2.6} /> הוספת ארוחה
      </button>

      {editGoals && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45" onClick={() => setEditGoals(false)}>
          <div dir="rtl" className="sheet-up max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-lg bg-paper p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="עריכת יעדים">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-medium">היעדים שלי</h2>
              <button aria-label="סגירה" onClick={() => setEditGoals(false)} className="rounded-md bg-ink/10 p-1.5">
                <X size={16} />
              </button>
            </div>
            <GoalsForm onSaved={() => setEditGoals(false)} />
          </div>
        </div>
      )}

      <section className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-water/15 text-water">
              <Droplets size={20} />
            </span>
            <div className="leading-tight">
              <h2 className="h-display text-[15px]">מים</h2>
              <p className="tnum text-[12px] text-ink/65">
                {glasses} מתוך {goals.water} כוסות
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="הפחת כוס" onClick={() => changeWater(today, -1)} className="flex h-10 w-10 items-center justify-center rounded-md bg-ink/[.06] active:scale-95">
              <Minus size={17} />
            </button>
            <button aria-label="הוסף כוס" onClick={() => changeWater(today, 1)} className="flex h-10 w-10 items-center justify-center rounded-md bg-water text-paper active:scale-95">
              <Plus size={17} strokeWidth={2.6} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: Math.max(goals.water, glasses) }).map((_, i) => (
            <Droplets key={i} size={22} strokeWidth={1.8} className={i < glasses ? 'text-water' : 'text-ink/15'} fill={i < glasses ? 'currentColor' : 'none'} />
          ))}
        </div>
      </section>
    </div>
  );
}
