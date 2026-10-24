import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';
import { addDays, sumMacros, todayISO, useStore } from '../lib/store';

const RANGES = [
  { id: '7', label: 'שבוע', days: 7 },
  { id: '30', label: 'חודש', days: 30 },
  { id: '90', label: '3 חודשים', days: 90 },
  { id: 'all', label: 'הכול', days: null },
];

const short = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
const tip = { borderRadius: 14, border: 'none', boxShadow: '0 6px 20px rgba(0,0,0,.5)', background: '#ffffff', color: '#1f2a21', direction: 'rtl', fontFamily: 'Heebo, sans-serif' };
const tick = { fontSize: 11, fill: '#8a8c80' };

export default function Progress() {
  const { state, addWeight, removeWeight } = useStore();
  const [range, setRange] = useState('30');
  const [date, setDate] = useState(todayISO());
  const [kg, setKg] = useState('');

  const data = useMemo(() => {
    const days = RANGES.find((r) => r.id === range).days;
    const from = days ? addDays(todayISO(), -days) : '0000';
    return state.weights.filter((w) => w.date >= from).map((w) => ({ ...w, label: short(w.date) }));
  }, [state.weights, range]);

  const calData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = addDays(todayISO(), i - 6);
        return { label: short(d), cal: Math.round(sumMacros(state.entries.filter((e) => e.date === d)).cal) };
      }),
    [state.entries]
  );

  const first = data[0]?.kg;
  const last = data[data.length - 1]?.kg;
  const delta = first != null && last != null ? Math.round((last - first) * 10) / 10 : null;

  const submit = (e) => {
    e.preventDefault();
    const v = parseFloat(kg);
    if (!v || v < 20 || v > 400) return;
    addWeight(date, Math.round(v * 10) / 10);
    setKg('');
  };

  return (
    <div className="space-y-6">
      <h1 className="h-display px-1 text-[1.6rem] leading-tight">התקדמות</h1>

      <section className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[13px] font-medium text-ink/70">משקל</h2>
            <p className="h-display tnum text-[2rem] leading-tight">
              {last ?? '–'}
              <span className="ms-1.5 text-base font-medium text-ink/55">ק״ג</span>
            </p>
          </div>
          {delta != null && (
            <span dir="ltr" className={`tnum rounded-md px-3 py-1 text-[11.5px] font-semibold ${delta <= 0 ? 'bg-leaf/15 text-leaf' : 'bg-carbs/15 text-carbs'}`}>
              {delta > 0 ? '+' : ''}
              {delta} ק״ג
            </span>
          )}
        </div>

        <div className="mt-4 flex rounded-md bg-ink/[.06] p-1">
          {RANGES.map((r) => (
            <button key={r.id} onClick={() => setRange(r.id)} className={`flex-1 rounded-md py-1.5 text-[11.5px] font-semibold transition ${range === r.id ? 'bg-white shadow-sm' : 'text-ink/65'}`}>
              {r.label}
            </button>
          ))}
        </div>

        <div dir="ltr" className="-ms-2 mt-4 h-52">
          {data.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e6e3d9" vertical={false} />
                <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} minTickGap={26} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={tick} tickLine={false} axisLine={false} width={36} tickFormatter={(v) => Math.round(v)} />
                <Tooltip formatter={(v) => [`${v} ק״ג`, 'משקל']} contentStyle={tip} />
                <Line type="monotone" dataKey="kg" stroke="#3f7d4e" strokeWidth={3} dot={{ r: 3, fill: '#3f7d4e', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p dir="rtl" className="flex h-full items-center justify-center text-[13px] text-ink/55">רשום לפחות שני שקילות כדי לראות מגמה.</p>
          )}
        </div>
      </section>

      <form onSubmit={submit} className="card space-y-3">
        <h2 className="h-display text-[15px]">רישום משקל</h2>
        <div className="grid grid-cols-2 gap-3">
          <input id="weight-date" aria-label="תאריך" className="input" type="date" max={todayISO()} value={date} onChange={(e) => setDate(e.target.value || todayISO())} />
          <input id="weight-kg" aria-label="משקל בק״ג" className="input tnum" type="number" inputMode="decimal" step="0.1" min="20" max="400" placeholder="ק״ג" value={kg} onChange={(e) => setKg(e.target.value)} />
        </div>
        <button className="btn w-full" disabled={!kg}>
          <Plus size={18} strokeWidth={2.6} /> שמירת שקילה
        </button>
      </form>

      <section className="card">
        <h2 className="h-display text-[15px]">קלוריות ב-7 הימים האחרונים</h2>
        <div dir="ltr" className="-ms-2 mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e6e3d9" vertical={false} />
              <XAxis dataKey="label" tick={{ ...tick, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={tick} tickLine={false} axisLine={false} width={40} />
              <Tooltip formatter={(v) => [`${v} קק״ל`, 'צריכה']} cursor={{ fill: 'rgba(31,42,33,.06)' }} contentStyle={tip} />
              <ReferenceLine y={state.goals.cal} stroke="#3f7d4e" strokeDasharray="4 4" />
              <Bar dataKey="cal" fill="#e2674f" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[11.5px] text-ink/60">הקו המקווקו הוא יעד הקלוריות היומי ({state.goals.cal}).</p>
      </section>

      <section className="card">
        <h2 className="h-display mb-1 text-lg">היסטוריית שקילות</h2>
        {state.weights.length === 0 && <p className="text-[13px] text-ink/55">אין עדיין רישומים.</p>}
        <ul className="divide-y divide-ink/[.07]">
          {[...state.weights].reverse().slice(0, 15).map((w) => (
            <li key={w.id} className="flex items-center justify-between py-3">
              <span className="text-[13px] text-ink/70">{short(w.date)}</span>
              <span className="flex items-center gap-3">
                <span className="tnum text-[13px] font-semibold">{w.kg} ק״ג</span>
                <button aria-label="מחק שקילה" onClick={() => removeWeight(w.id)} className="text-ink/25 active:text-cal">
                  <Trash2 size={16} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
