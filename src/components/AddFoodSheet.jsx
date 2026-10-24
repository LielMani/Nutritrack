import { useEffect, useState } from 'react';
import { BadgeCheck, Bookmark, Loader2, PenLine, Plus, Search, Sparkles, Trash2, X } from 'lucide-react';
import { analyzeFoodText, searchFoods } from '../lib/ai';
import { MEALS, sumMacros, useStore } from '../lib/store';

const TABS = [
  { id: 'ai', label: 'AI', icon: Sparkles },
  { id: 'search', label: 'חיפוש', icon: Search },
  { id: 'quick', label: 'ידני', icon: PenLine },
  { id: 'saved', label: 'שמורות', icon: Bookmark },
];

const Macros = ({ i }) => (
  <p className="tnum text-[11.5px] text-ink/65">
    {Math.round(i.cal)} קק״ל · ח׳ {Math.round(i.p)} · פ׳ {Math.round(i.c)} · ש׳ {Math.round(i.f)}
  </p>
);

export default function AddFoodSheet({ date, meal, onClose }) {
  const [tab, setTab] = useState('ai');
  const { addEntries } = useStore();
  const label = MEALS.find((m) => m.id === meal).label;

  const commit = (items) => {
    addEntries(date, meal, items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45" onClick={onClose}>
      <div
        dir="rtl"
        className="sheet-up flex max-h-[88vh] w-full max-w-md flex-col rounded-t-lg bg-paper"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`הוספת מזון ל${label}`}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-md bg-ink/15" />
        <div className="flex items-center justify-between px-5 pb-3 pt-3">
          <h2 className="h-display text-[15px]">{label}</h2>
          <button aria-label="סגירה" onClick={onClose} className="rounded-md bg-ink/10 p-1.5">
            <X size={16} />
          </button>
        </div>

        <div className="mx-4 flex rounded-md bg-ink/[.07] p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13px] font-semibold transition ${tab === id ? 'bg-white text-ink shadow-sm' : 'text-ink/65'}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
          {tab === 'ai' && <AiTab onAdd={commit} />}
          {tab === 'search' && <SearchTab onAdd={commit} />}
          {tab === 'quick' && <QuickTab onAdd={commit} />}
          {tab === 'saved' && <SavedTab onAdd={commit} />}
        </div>
      </div>
    </div>
  );
}

function AiTab({ onAdd }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      setResult(await analyzeFoodText(text));
    } catch (e) {
      setError(e.message || 'משהו השתבש. נסה שוב.');
    } finally {
      setBusy(false);
    }
  };

  const dropItem = (idx) => setResult((r) => ({ ...r, items: r.items.filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-ink/70">ספר מה אכלת בחופשיות. הערכים מחושבים לפי טבלאות USDA.</p>
      <textarea id="ai-food-text" className="input min-h-[92px] resize-none" placeholder="למשל: אכלתי תפוח ושתי ביצים" value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn w-full" onClick={run} disabled={busy || !text.trim()}>
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        {busy ? 'מנתח…' : 'ניתוח עם AI'}
      </button>
      {error && <p className="text-[13px] text-cal">{error}</p>}

      {result && (
        <div className="space-y-2">
          {result.items.length === 0 && <p className="text-[13px] text-ink/70">לא זוהה אוכל. נסה לנסח אחרת או השתמש בחיפוש.</p>}
          {result.items.map((i, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-md bg-ink/[.045] p-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{i.name}</p>
                <p className="text-[11.5px] text-ink/55">{i.detail}</p>
                <Macros i={i} />
              </div>
              <button aria-label="הסר פריט" onClick={() => dropItem(idx)} className="p-1.5 text-ink/25">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {result.unmatched?.length > 0 && <p className="text-[11.5px] text-carbs">לא זוהה: {result.unmatched.join(', ')}</p>}
          {result.items.length > 0 && (
            <>
              <p className="tnum text-end text-[13px] font-semibold">סך הכול {Math.round(sumMacros(result.items).cal)} קק״ל</p>
              <button className="btn w-full" onClick={() => onAdd(result.items)}>
                <Plus size={18} /> {result.items.length === 1 ? 'הוספת פריט' : `הוספת ${result.items.length} פריטים`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SearchTab({ onAdd }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (value) => {
    setQ(value);
    setBusy(true);
    const r = await searchFoods(value);
    setResults(r);
    setBusy(false);
  };

  useEffect(() => {
    run('');
  }, []);

  return (
    <div className="space-y-3">
      <input id="food-search" className="input" placeholder="חיפוש מזון (עוף, אורז, תפוח…)" value={q} onChange={(e) => run(e.target.value)} autoFocus />
      {busy && !results && <Loader2 className="mx-auto animate-spin text-ink/30" />}
      <ul className="space-y-2">
        {(results || []).map((r) => (
          <li key={r.id} className="flex items-center gap-3 rounded-md bg-ink/[.045] p-3.5">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[13px] font-semibold">
                <span className="truncate">{r.name}</span>
                <BadgeCheck size={14} className="shrink-0 text-leaf" />
              </p>
              <p className="text-[11.5px] text-ink/55">{r.detail}</p>
              <Macros i={r} />
            </div>
            <button aria-label={`הוסף ${r.name}`} onClick={() => onAdd([r])} className="rounded-md bg-leaf p-2.5 text-paper active:scale-95">
              <Plus size={16} strokeWidth={2.6} />
            </button>
          </li>
        ))}
        {results && results.length === 0 && <p className="text-center text-[13px] text-ink/70">לא נמצאו תוצאות.</p>}
      </ul>
    </div>
  );
}

function QuickTab({ onAdd }) {
  const [f, setF] = useState({ name: '', cal: '', p: '', c: '', f: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const num = (v) => Math.max(0, parseFloat(v) || 0);
  const calFromMacros = Math.round(num(f.p) * 4 + num(f.c) * 4 + num(f.f) * 9);
  const cal = f.cal === '' ? calFromMacros : num(f.cal);
  const valid = cal > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onAdd([{ name: f.name.trim() || 'הוספה מהירה', cal, p: num(f.p), c: num(f.c), f: num(f.f) }]);
  };

  // פונקציה רגילה ולא קומפוננטה, כדי שהשדות לא יאבדו פוקוס בכל הקלדה
  const field = (k, label, ph) => (
    <label key={k} className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-ink/70">{label}</span>
      <input id={`quick-${k}`} className="input tnum" inputMode="decimal" type="number" min="0" step="any" placeholder={ph} value={f[k]} onChange={set(k)} />
    </label>
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-[11.5px] font-medium text-ink/70">שם (לא חובה)</span>
        <input id="quick-name" className="input" placeholder="הוספה מהירה" value={f.name} onChange={set('name')} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        {field('cal', 'קלוריות (קק״ל)', calFromMacros ? String(calFromMacros) : '0')}
        {field('p', 'חלבון (ג׳)', '0')}
        {field('c', 'פחמימות (ג׳)', '0')}
        {field('f', 'שומנים (ג׳)', '0')}
      </div>
      <p className="text-[11.5px] text-ink/60">אם משאירים קלוריות ריק, הן מחושבות מהמאקרו (4/4/9).</p>
      <button className="btn w-full" disabled={!valid}>
        <Plus size={18} /> הוספה {valid ? `· ${Math.round(cal)} קק״ל` : ''}
      </button>
    </form>
  );
}

function SavedTab({ onAdd }) {
  const { state, deleteSaved } = useStore();
  if (state.saved.length === 0)
    return <p className="py-6 text-center text-[13px] text-ink/70">אין עדיין ארוחות שמורות. רשום ארוחה ולחץ על סימן הסימנייה בכרטיס שלה כדי לשמור אותה.</p>;

  return (
    <ul className="space-y-2">
      {state.saved.map((m) => {
        const t = sumMacros(m.items);
        return (
          <li key={m.id} className="rounded-md bg-ink/[.045] p-3.5">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{m.name}</p>
                <p className="truncate text-[11.5px] text-ink/55">{m.items.map((i) => i.name.split(/[,(]/)[0].trim()).join(' · ')}</p>
                <Macros i={t} />
              </div>
              <button aria-label="מחק ארוחה שמורה" onClick={() => deleteSaved(m.id)} className="p-1.5 text-ink/25">
                <Trash2 size={16} />
              </button>
            </div>
            <button className="btn mt-3 w-full !py-3" onClick={() => onAdd(m.items)}>
              <Plus size={16} strokeWidth={2.6} /> הוספה לארוחה
            </button>
          </li>
        );
      })}
    </ul>
  );
}
