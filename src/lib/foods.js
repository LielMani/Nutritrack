// מאגר מזונות. ערכים ל-100 גרם לפי USDA FoodData Central (SR Legacy).
// `unit` הוא מנה ביתית טיפוסית כשלא צוין משקל. `keys` כוללים עברית ואנגלית לזיהוי טקסט חופשי.
export const FOODS = [
  { id: 'apple', name: 'תפוח עץ, גולמי', keys: ['תפוח', 'apple'], per100: { cal: 52, p: 0.3, c: 13.8, f: 0.2 }, unit: { label: 'תפוח בינוני', g: 182 } },
  { id: 'banana', name: 'בננה', keys: ['בננה', 'banana'], per100: { cal: 89, p: 1.1, c: 22.8, f: 0.3 }, unit: { label: 'בננה בינונית', g: 118 } },
  { id: 'orange', name: 'תפוז', keys: ['תפוז', 'orange'], per100: { cal: 47, p: 0.9, c: 11.8, f: 0.1 }, unit: { label: 'תפוז בינוני', g: 131 } },
  { id: 'egg', name: 'ביצה, מבושלת', keys: ['ביצ', 'egg'], per100: { cal: 155, p: 12.6, c: 1.1, f: 10.6 }, unit: { label: 'ביצה גדולה', g: 50 } },
  { id: 'chicken', name: 'חזה עוף, צלוי', keys: ['עוף', 'chicken'], per100: { cal: 165, p: 31, c: 0, f: 3.6 }, unit: { label: 'חזה עוף (120 גרם)', g: 120 } },
  { id: 'beef', name: 'בשר בקר טחון 10% שומן, מבושל', keys: ['בשר טחון', 'בקר', 'המבורגר', 'ground beef', 'beef', 'burger'], per100: { cal: 217, p: 26.1, c: 0, f: 11.8 }, unit: { label: 'קציצה (100 גרם)', g: 100 } },
  { id: 'salmon', name: 'סלמון, מבושל', keys: ['סלמון', 'salmon'], per100: { cal: 206, p: 22.1, c: 0, f: 12.4 }, unit: { label: 'פילה (154 גרם)', g: 154 } },
  { id: 'tuna', name: 'טונה במים, מסוננת', keys: ['טונה', 'tuna'], per100: { cal: 116, p: 25.5, c: 0, f: 0.8 }, unit: { label: 'קופסה (113 גרם)', g: 113 } },
  { id: 'tofu', name: 'טופו קשה', keys: ['טופו', 'tofu'], per100: { cal: 144, p: 17.3, c: 2.8, f: 8.7 }, unit: { label: 'מנה (100 גרם)', g: 100 } },
  { id: 'rice', name: 'אורז לבן, מבושל', keys: ['אורז', 'rice'], per100: { cal: 130, p: 2.7, c: 28.2, f: 0.3 }, unit: { label: 'כוס (158 גרם)', g: 158 } },
  { id: 'pasta', name: 'פסטה, מבושלת', keys: ['פסטה', 'ספגטי', 'pasta', 'spaghetti'], per100: { cal: 158, p: 5.8, c: 30.9, f: 0.9 }, unit: { label: 'כוס (140 גרם)', g: 140 } },
  { id: 'oats', name: 'שיבולת שועל, יבשה', keys: ['שיבולת שועל', 'קוואקר', 'דייסה', 'oatmeal', 'oats', 'oat'], per100: { cal: 389, p: 16.9, c: 66.3, f: 6.9 }, unit: { label: '½ כוס (40 גרם)', g: 40 } },
  { id: 'wheatbread', name: 'לחם מקמח מלא', keys: ['לחם', 'טוסט', 'פרוסה', 'whole wheat', 'bread', 'toast'], per100: { cal: 247, p: 13, c: 41, f: 3.4 }, unit: { label: 'פרוסה (28 גרם)', g: 28 } },
  { id: 'whitebread', name: 'לחם לבן', keys: ['לחם לבן', 'white bread'], per100: { cal: 265, p: 9, c: 49, f: 3.2 }, unit: { label: 'פרוסה (25 גרם)', g: 25 } },
  { id: 'pita', name: 'פיתה', keys: ['פיתה', 'pita'], per100: { cal: 275, p: 9.1, c: 55.7, f: 1.2 }, unit: { label: 'פיתה (60 גרם)', g: 60 } },
  { id: 'potato', name: 'תפוח אדמה, אפוי', keys: ['תפוח אדמה', 'תפו"א', 'תפוא', 'potato'], per100: { cal: 93, p: 2.5, c: 21.2, f: 0.1 }, unit: { label: 'בינוני (173 גרם)', g: 173 } },
  { id: 'sweetpotato', name: 'בטטה, אפויה', keys: ['בטטה', 'sweet potato'], per100: { cal: 90, p: 2, c: 20.7, f: 0.2 }, unit: { label: 'בינונית (130 גרם)', g: 130 } },
  { id: 'lentils', name: 'עדשים, מבושלות', keys: ['עדש', 'lentil'], per100: { cal: 116, p: 9, c: 20.1, f: 0.4 }, unit: { label: 'כוס (198 גרם)', g: 198 } },
  { id: 'broccoli', name: 'ברוקולי, מבושל', keys: ['ברוקולי', 'broccoli'], per100: { cal: 35, p: 2.4, c: 7.2, f: 0.4 }, unit: { label: 'כוס (156 גרם)', g: 156 } },
  { id: 'tomato', name: 'עגבנייה', keys: ['עגבני', 'tomato'], per100: { cal: 18, p: 0.9, c: 3.9, f: 0.2 }, unit: { label: 'עגבנייה בינונית', g: 123 } },
  { id: 'cucumber', name: 'מלפפון', keys: ['מלפפון', 'cucumber'], per100: { cal: 15, p: 0.7, c: 3.6, f: 0.1 }, unit: { label: '½ מלפפון (150 גרם)', g: 150 } },
  { id: 'avocado', name: 'אבוקדו', keys: ['אבוקדו', 'avocado'], per100: { cal: 160, p: 2, c: 8.5, f: 14.7 }, unit: { label: '½ אבוקדו (100 גרם)', g: 100 } },
  { id: 'yogurt', name: 'יוגורט יווני 0%', keys: ['יוגורט', 'yogurt', 'yoghurt'], per100: { cal: 59, p: 10.2, c: 3.6, f: 0.4 }, unit: { label: 'גביע (170 גרם)', g: 170 } },
  { id: 'cottage', name: 'קוטג׳ 5%', keys: ['קוטג', 'cottage'], per100: { cal: 98, p: 11.1, c: 3.4, f: 4.3 }, unit: { label: 'גביע (250 גרם)', g: 250 } },
  { id: 'milk', name: 'חלב 3%', keys: ['חלב', 'milk'], per100: { cal: 61, p: 3.2, c: 4.8, f: 3.3 }, unit: { label: 'כוס (244 גרם)', g: 244 } },
  { id: 'cheddar', name: 'גבינה צהובה (צ׳דר)', keys: ['גבינה צהובה', 'גבינה', 'צ\'דר', 'צדר', 'cheddar', 'cheese'], per100: { cal: 403, p: 22.9, c: 3.1, f: 33.3 }, unit: { label: 'פרוסה (28 גרם)', g: 28 } },
  { id: 'almonds', name: 'שקדים', keys: ['שקד', 'almond'], per100: { cal: 579, p: 21.2, c: 21.6, f: 49.9 }, unit: { label: 'חופן (28 גרם)', g: 28 } },
  { id: 'pb', name: 'חמאת בוטנים', keys: ['חמאת בוטנים', 'peanut butter'], per100: { cal: 588, p: 25, c: 20, f: 50 }, unit: { label: 'כף (16 גרם)', g: 16 } },
  { id: 'tahini', name: 'טחינה גולמית', keys: ['טחינה', 'tahini'], per100: { cal: 595, p: 17, c: 21.2, f: 53.8 }, unit: { label: 'כף (15 גרם)', g: 15 } },
  { id: 'oliveoil', name: 'שמן זית', keys: ['שמן זית', 'שמן', 'olive oil', 'oil'], per100: { cal: 884, p: 0, c: 0, f: 100 }, unit: { label: 'כף (13.5 גרם)', g: 13.5 } },
  { id: 'hummus', name: 'חומוס', keys: ['חומוס', 'hummus'], per100: { cal: 166, p: 7.9, c: 14.3, f: 9.6 }, unit: { label: '2 כפות (30 גרם)', g: 30 } },
  { id: 'whey', name: 'אבקת חלבון (whey)', keys: ['אבקת חלבון', 'שייק חלבון', 'protein powder', 'whey', 'protein shake'], per100: { cal: 400, p: 80, c: 8, f: 6 }, unit: { label: 'סקופ (30 גרם)', g: 30 } },
  { id: 'pizza', name: 'פיצה גבינה', keys: ['פיצה', 'pizza'], per100: { cal: 266, p: 11, c: 33, f: 10 }, unit: { label: 'משולש (107 גרם)', g: 107 } },
  { id: 'darkchoc', name: 'שוקולד מריר 70-85%', keys: ['שוקולד', 'chocolate'], per100: { cal: 598, p: 7.8, c: 46, f: 43 }, unit: { label: 'שורה (28 גרם)', g: 28 } },
];

const r1 = (n) => Math.round(n * 10) / 10;

export function macrosFor(food, grams) {
  const k = grams / 100;
  return {
    cal: Math.round(food.per100.cal * k),
    p: r1(food.per100.p * k),
    c: r1(food.per100.c * k),
    f: r1(food.per100.f * k),
  };
}

export function servingItem(food, servings = 1) {
  const grams = food.unit.g * servings;
  return { name: food.name, detail: `${servings !== 1 ? servings + ' × ' : ''}${food.unit.label}`, ...macrosFor(food, grams) };
}
