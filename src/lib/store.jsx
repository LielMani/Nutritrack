import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const MEALS = [
  { id: 'breakfast', label: 'ארוחת בוקר', icon: 'Sunrise' },
  { id: 'morning', label: 'נשנוש בוקר', icon: 'Apple' },
  { id: 'lunch', label: 'ארוחת צהריים', icon: 'UtensilsCrossed' },
  { id: 'afternoon', label: 'נשנוש אחר הצהריים', icon: 'Cookie' },
  { id: 'dinner', label: 'ארוחת ערב', icon: 'Moon' },
];

export const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const todayISO = () => toISO(new Date());
export const addDays = (iso, n) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return toISO(d);
};
export const uid = () => Math.random().toString(36).slice(2, 10);
export const sumMacros = (items) =>
  items.reduce(
    (a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }),
    { cal: 0, p: 0, c: 0, f: 0 }
  );

const KEY = 'nutritrack:v2-he';

function seed() {
  const today = todayISO();
  const yesterday = addDays(today, -1);
  const e = (date, meal, name, cal, p, c, f) => ({ id: uid(), date, meal, name, cal, p, c, f });
  const entries = [
    e(today, 'breakfast', 'שיבולת שועל, יבשה (½ כוס)', 156, 6.8, 26.5, 2.8),
    e(today, 'breakfast', 'בננה (בננה בינונית)', 105, 1.3, 26.9, 0.4),
    e(today, 'breakfast', 'ביצה, מבושלת (2 × ביצה גדולה)', 155, 12.6, 1.1, 10.6),
    e(today, 'morning', 'יוגורט יווני 0% (גביע)', 100, 17.3, 6.1, 0.7),
    e(today, 'lunch', 'חזה עוף, צלוי (150 גרם)', 248, 46.5, 0, 5.4),
    e(today, 'lunch', 'אורז לבן, מבושל (כוס)', 205, 4.3, 44.5, 0.4),
  ];
  // שבוע של היסטוריה לגרפים
  const hist = [
    [1900, 128, 210, 62], [2150, 140, 240, 70], [1820, 120, 200, 58],
    [2300, 150, 255, 78], [2050, 135, 225, 66], [1950, 130, 215, 64], [2100, 138, 230, 68],
  ];
  hist.forEach(([cal, p, c, f], i) => {
    entries.push(e(addDays(today, -(7 - i)), 'lunch', 'סיכום יומי (נתוני דוגמה)', cal, p, c, f));
  });
  entries.push(e(yesterday, 'dinner', 'סלמון, מבושל (פילה 154 גרם)', 317, 34, 0, 19.1));

  const weights = [];
  for (let i = 60; i >= 0; i -= 2) {
    const kg = 83 - (60 - i) * 0.055 + Math.sin(i * 1.7) * 0.35;
    weights.push({ id: uid(), date: addDays(today, -i), kg: Math.round(kg * 10) / 10 });
  }

  return {
    goals: { cal: 2200, p: 150, c: 250, f: 70, water: 8 },
    entries,
    water: { [today]: 3, [yesterday]: 7 },
    weights,
    saved: [
      {
        id: uid(),
        name: 'דייסת חלבון',
        items: [
          { name: 'שיבולת שועל, יבשה (½ כוס)', cal: 156, p: 6.8, c: 26.5, f: 2.8 },
          { name: 'אבקת חלבון (סקופ)', cal: 120, p: 24, c: 2.4, f: 1.8 },
          { name: 'בננה (בננה בינונית)', cal: 105, p: 1.3, c: 26.9, f: 0.4 },
        ],
      },
      {
        id: uid(),
        name: 'קערת עוף ואורז',
        items: [
          { name: 'חזה עוף, צלוי (150 גרם)', cal: 248, p: 46.5, c: 0, f: 5.4 },
          { name: 'אורז לבן, מבושל (כוס)', cal: 205, p: 4.3, c: 44.5, f: 0.4 },
          { name: 'ברוקולי, מבושל (כוס)', cal: 55, p: 3.7, c: 11.2, f: 0.6 },
        ],
      },
    ],
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* אחסון פגום או חסום: ממשיכים עם נתוני דוגמה */
  }
  return seed();
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* מכסה מלאה או מצב פרטי: ממשיכים בזיכרון */
    }
  }, [state]);

  const patch = useCallback((fn) => setState((s) => fn(s)), []);

  const api = useMemo(
    () => ({
      state,
      addEntries: (date, meal, items) =>
        patch((s) => ({ ...s, entries: [...s.entries, ...items.map((i) => ({ id: uid(), date, meal, name: i.detail ? `${i.name} (${i.detail})` : i.name, cal: Math.round(i.cal), p: i.p, c: i.c, f: i.f }))] })),
      removeEntry: (id) => patch((s) => ({ ...s, entries: s.entries.filter((x) => x.id !== id) })),
      setGoals: (goals) => patch((s) => ({ ...s, goals })),
      changeWater: (date, d) =>
        patch((s) => ({ ...s, water: { ...s.water, [date]: Math.max(0, (s.water[date] || 0) + d) } })),
      addWeight: (date, kg) =>
        patch((s) => ({
          ...s,
          weights: [...s.weights.filter((w) => w.date !== date), { id: uid(), date, kg }].sort((a, b) => a.date.localeCompare(b.date)),
        })),
      removeWeight: (id) => patch((s) => ({ ...s, weights: s.weights.filter((w) => w.id !== id) })),
      saveMeal: (name, items) => patch((s) => ({ ...s, saved: [...s.saved, { id: uid(), name, items }] })),
      deleteSaved: (id) => patch((s) => ({ ...s, saved: s.saved.filter((m) => m.id !== id) })),
      resetDemo: () => setState(seed()),
      clearAll: () => setState({ ...seed(), entries: [], weights: [], water: {}, saved: [] }),
    }),
    [state, patch]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
