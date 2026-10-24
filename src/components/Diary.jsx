import { useState } from 'react';
import { Apple, BookmarkPlus, ChevronLeft, ChevronRight, Cookie, Moon, Plus, Sunrise, Trash2, UtensilsCrossed } from 'lucide-react';
import AddFoodSheet from './AddFoodSheet';
import { MEALS, addDays, sumMacros, todayISO, useStore } from '../lib/store';

const ICONS = { Sunrise, Apple, UtensilsCrossed, Cookie, Moon };

function dateLabel(iso) {
  const today = todayISO();
  if (iso === today) return 'היום';
  if (iso === addDays(today, -1)) return 'אתמול';
  if (iso === addDays(today, 1)) return 'מחר';
  return new Date(iso + 'T12:00:00').toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function Diary() {
  const { state, removeEntry, saveMeal } = useStore();
  const [date, setDate] = useState(todayISO());
  const [adding, setAdding] = useState(null); // מזהה ארוחה
  const [saving, setSaving] = useState(null); // { meal, items, name }
  const day = state.entries.filter((e) => e.date === date);
  const total = sumMacros(day);

  const startSave = (meal, items) => setSaving({ items, name: MEALS.find((m) => m.id === meal).label });
  const confirmSave = (e) => {
    e.preventDefault();
    const name = saving.name.trim();
    if (!name) return;
    saveMeal(name, saving.items.map(({ name, cal, p, c, f }) => ({ name, cal, p, c, f })));
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <h1 className="h-display text-[1.6rem] leading-tight">יומן</h1>
        <div className="flex items-center gap-0.5 rounded-md bg-ink/[.06] p-1">
          {/* בכיוון RTL החץ הימני הוא "הקודם" */}
          <button aria-label="היום הקודם" onClick={() => setDate(addDays(date, -1))} className="rounded-md p-2 active:bg-ink/[.06]">
            <ChevronRight size={18} />
          </button>
          <span className="min-w-[84px] text-center text-[13px] font-semibold">{dateLabel(date)}</span>
          <button aria-label="היום הבא" onClick={() => setDate(addDays(date, 1))} className="rounded-md p-2 active:bg-ink/[.06]">
            <ChevronLeft size={18} />
          </button>
        </div>
      </header>

      <div className="card grid grid-cols-4 gap-2 !p-5 text-center">
        {[
          ['קלוריות', Math.round(total.cal), 'text-cal'],
          ['חלבון', Math.round(total.p) + ' ג׳', 'text-protein'],
          ['פחמימות', Math.round(total.c) + ' ג׳', 'text-carbs'],
          ['שומנים', Math.round(total.f) + ' ג׳', 'text-fat'],
        ].map(([l, v, cls]) => (
          <div key={l}>
            <p className={`h-display tnum text-lg ${cls}`}>{v}</p>
            <p className="text-[11px] text-ink/70">{l}</p>
          </div>
        ))}
      </div>

      {MEALS.map((meal) => {
        const Icon = ICONS[meal.icon];
        const items = day.filter((e) => e.meal === meal.id);
        const t = sumMacros(items);
        return (
          <section key={meal.id} className="card !p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-leaf/10 text-leaf">
                <Icon size={20} />
              </span>
              <h2 className="h-display flex-1 text-[15px]">{meal.label}</h2>
              <span className="tnum text-[13px] font-medium text-ink/70">{Math.round(t.cal)} קק״ל</span>
            </div>

            {items.length > 0 && (
              <ul className="mt-3 divide-y divide-ink/[.07]">
                {items.map((e) => (
                  <li key={e.id} className="flex items-center gap-2 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{e.name}</p>
                      <p className="tnum text-[11.5px] text-ink/65">
                        {e.cal} קק״ל · ח׳ {Math.round(e.p)} · פ׳ {Math.round(e.c)} · ש׳ {Math.round(e.f)}
                      </p>
                    </div>
                    <button aria-label={`מחק ${e.name}`} onClick={() => removeEntry(e.id)} className="p-2 text-ink/25 active:text-cal">
                      <Trash2 size={17} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={() => setAdding(meal.id)} className="btn-ghost flex-1 !py-2.5 !text-leaf">
                <Plus size={17} strokeWidth={2.6} /> הוספת מזון
              </button>
              {items.length > 0 && (
                <button onClick={() => startSave(meal.id, items)} className="btn-ghost !px-3.5 !py-3" aria-label="שמירה כארוחה שמורה" title="שמירה כארוחה שמורה">
                  <BookmarkPlus size={18} />
                </button>
              )}
            </div>
          </section>
        );
      })}

      {adding && <AddFoodSheet date={date} meal={adding} onClose={() => setAdding(null)} />}

      {saving && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45" onClick={() => setSaving(null)}>
          <form onSubmit={confirmSave} onClick={(e) => e.stopPropagation()} dir="rtl" className="sheet-up w-full max-w-md space-y-3 rounded-t-lg bg-paper p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <h2 className="h-display text-[15px]">שמירה כארוחה שמורה</h2>
            <input id="saved-meal-name" className="input" value={saving.name} onChange={(e) => setSaving({ ...saving, name: e.target.value })} placeholder="שם הארוחה" autoFocus />
            <div className="flex gap-2">
              <button type="button" className="btn-ghost flex-1" onClick={() => setSaving(null)}>
                ביטול
              </button>
              <button className="btn flex-1" disabled={!saving.name.trim()}>
                שמירה
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
