import { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../lib/store';

const FIELDS = [
  { k: 'cal', label: 'קלוריות ליום', unit: 'קק״ל', color: 'bg-cal' },
  { k: 'p', label: 'חלבון', unit: 'גרם', color: 'bg-protein' },
  { k: 'c', label: 'פחמימות', unit: 'גרם', color: 'bg-carbs' },
  { k: 'f', label: 'שומנים', unit: 'גרם', color: 'bg-fat' },
  { k: 'water', label: 'מים', unit: 'כוסות', color: 'bg-water' },
];

// טופס עריכת יעדים. משמש גם בהגדרות וגם בחלון העריכה במסך הבית.
export default function GoalsForm({ onSaved }) {
  const { state, setGoals } = useStore();
  const [g, setG] = useState({ ...state.goals });
  const [saved, setSaved] = useState(false);

  const num = (k) => Math.max(0, Math.round(Number(g[k]) || 0));
  const fromMacros = num('p') * 4 + num('c') * 4 + num('f') * 9;
  const valid = num('cal') > 0;

  const save = (e) => {
    e.preventDefault();
    if (!valid) return;
    setGoals({ cal: num('cal'), p: num('p'), c: num('c'), f: num('f'), water: num('water') });
    setSaved(true);
    if (onSaved) onSaved();
    else setTimeout(() => setSaved(false), 1800);
  };

  return (
    <form onSubmit={save} className="space-y-3">
      {FIELDS.map(({ k, label, unit, color }) => (
        <label key={k} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[13px] font-semibold">
            <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
            {label}
          </span>
          <span className="flex w-40 items-center gap-2">
            <input id={`goal-${k}`} className="input tnum !py-2 text-center" type="number" inputMode="numeric" min="0" value={g[k]} onChange={(e) => setG({ ...g, [k]: e.target.value })} />
            <span className="w-10 text-[11.5px] text-ink/60">{unit}</span>
          </span>
        </label>
      ))}
      <p className="rounded-md bg-ink/[.06] p-3 text-[11.5px] leading-relaxed text-ink/70">
        המאקרו שהגדרת מסתכם ב-<b className="tnum">{fromMacros}</b> קק״ל (4/4/9 קק״ל לגרם)
        {num('cal') > 0 && Math.abs(fromMacros - num('cal')) > num('cal') * 0.1 && (
          <>
            {' '}
            ונמצא {fromMacros > num('cal') ? 'מעל' : 'מתחת ל'}יעד הקלוריות.{' '}
            <button type="button" className="font-semibold text-leaf" onClick={() => setG({ ...g, cal: fromMacros })}>
              להשתמש ב-{fromMacros}
            </button>
          </>
        )}
        .
      </p>
      <button className="btn w-full" disabled={!valid}>
        {saved ? <Check size={18} /> : null} {saved ? 'נשמר' : 'שמירת יעדים'}
      </button>
    </form>
  );
}
