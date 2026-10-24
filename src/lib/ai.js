import { FOODS, macrosFor, servingItem } from './foods';

/* ------------------------------------------------------------------ *
 * סוכן ה-AI לזיהוי אוכל
 * כדי לעבור ל-OpenAI אמיתי: הגדר VITE_OPENAI_API_KEY וה-analyzeFoodText()
 * יקרא ל-OpenAI עם הפרומפט של הדיאטן הקליני למטה. בלי מפתח הוא משתמש
 * במנתח מקומי שמבוסס על ערכי USDA, כך שהאפליקציה עובדת גם בלי שרת.
 *
 * שים לב: מפתח בקוד צד-לקוח חשוף למשתמשים. בפרודקשן כדאי להפנות את
 * OPENAI_URL לשרת ביניים שמחזיק את המפתח.
 * ------------------------------------------------------------------ */

export const SYSTEM_PROMPT = `You are a Clinical Dietitian (RD) with expert knowledge of the USDA FoodData Central database.
The user will describe what they ate in free text. They may write in Hebrew or English. Your job:
1. Identify every distinct food or drink and its quantity. If no quantity is given, assume one standard USDA household serving and state the assumption in "quantity".
2. Look up each item using standard USDA nutrition facts (SR Legacy / Foundation Foods values). Prefer cooked values for cooked foods and raw values for raw foods. Never invent values or round aggressively.
3. Scale the per-100g USDA values to the estimated weight in grams.
4. Write "name" and "quantity" in Hebrew.
5. Return ONLY valid JSON, no prose, in exactly this shape:
{"items":[{"name":string,"quantity":string,"grams":number,"calories":number,"protein_g":number,"carbs_g":number,"fat_g":number}]}
Calories must be consistent with macros (4/4/9 kcal per g) within ~10%. If an input is not food, return {"items":[]}.`;

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(text, apiKey) {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) throw new Error(`הבקשה ל-AI נכשלה (${res.status})`);
  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return (parsed.items || []).map((i) => ({
    name: i.name,
    detail: i.quantity,
    cal: Math.round(i.calories),
    p: Math.round(i.protein_g * 10) / 10,
    c: Math.round(i.carbs_g * 10) / 10,
    f: Math.round(i.fat_g * 10) / 10,
  }));
}

/* ---------------- מנתח מקומי (גיבוי) ---------------- */

const NUM_WORDS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, couple: 2,
  אחד: 1, אחת: 1, שני: 2, שתי: 2, שניים: 2, שתיים: 2, שלוש: 3, שלושה: 3, ארבע: 4, ארבעה: 4,
  חמש: 5, חמישה: 5, שש: 6, שישה: 6, חצי: 0.5, זוג: 2,
};
const FILLER = new Set([
  'i', 'ate', 'had', 'have', 'eaten', 'drank', 'for', 'breakfast', 'lunch', 'dinner', 'snack', 'some', 'of', 'the', 'my', 'today', 'with', 'plus',
  'אכלתי', 'שתיתי', 'אני', 'עם', 'של', 'קצת', 'היום', 'לארוחת', 'בוקר', 'צהריים', 'ערב', 'ארוחת', 'ואז', 'גם',
]);

function parsePart(raw) {
  const part = raw.toLowerCase().trim();
  if (!part) return null;

  // המפתח הארוך ביותר מנצח ("חמאת בוטנים" לפני "חמאה", "בטטה" לפני "תפוח")
  let best = null;
  let bestLen = 0;
  for (const food of FOODS) {
    for (const key of food.keys) {
      if (part.includes(key) && key.length > bestLen) {
        best = food;
        bestLen = key.length;
      }
    }
  }
  if (!best) return { unmatched: raw.trim() };

  const grams = part.match(/(\d+(?:\.\d+)?)\s*(?:(?:g|gr|gram|grams|ml)(?![a-z])|גרם|גרמים|גר׳|גר'|מ"ל|מל)/);
  if (grams) {
    const g = parseFloat(grams[1]);
    return { item: { name: best.name, detail: `${g} גרם`, ...macrosFor(best, g) } };
  }

  const tokens = part.split(/\s+/).filter((t) => t && !FILLER.has(t));
  const first = tokens[0] || '';
  let qty = 1;
  if (first.includes('/')) {
    const [a, b] = first.split('/').map(Number);
    if (a && b) qty = a / b;
  } else if (!isNaN(parseFloat(first))) qty = parseFloat(first);
  else if (NUM_WORDS[first] != null) qty = NUM_WORDS[first];
  return { item: servingItem(best, qty) };
}

async function mockAnalyze(text) {
  await new Promise((r) => setTimeout(r, 900)); // מדמה זמן תגובה של שרת
  // "ו" בעברית נדבקת למילה הבאה, ולכן מפצלים גם לפי רווח + ו
  const parts = text.split(/,|\band\b|\+|&|;|\n|\sו(?=\S)/i);
  const items = [];
  const unmatched = [];
  for (const p of parts) {
    const out = parsePart(p);
    if (!out) continue;
    if (out.item) items.push(out.item);
    else unmatched.push(out.unmatched);
  }
  return { items, unmatched };
}

/** החזר: { items: [{name, detail, cal, p, c, f}], unmatched: string[] } */
export async function analyzeFoodText(text) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (key) return { items: await callOpenAI(text, key), unmatched: [] };
  return mockAnalyze(text);
}

/** חיפוש מדומה במאגר מזונות מאומת. אפשר להחליף בקריאה ל-USDA FDC API. */
export async function searchFoods(query) {
  await new Promise((r) => setTimeout(r, 250));
  const q = query.trim().toLowerCase();
  if (!q) return FOODS.slice(0, 12).map(toResult);
  return FOODS.filter((f) => f.name.toLowerCase().includes(q) || f.keys.some((k) => k.includes(q) || q.includes(k))).map(toResult);
}

const toResult = (food) => ({ id: food.id, food, ...servingItem(food, 1), verified: true });
