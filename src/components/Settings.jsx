import { useState } from 'react';
import { Download, RotateCcw, Trash2 } from 'lucide-react';
import GoalsForm from './GoalsForm';
import { useStore } from '../lib/store';

export default function Settings() {
  const { state, resetDemo, clearAll } = useStore();
  const [confirm, setConfirm] = useState(null); // 'reset' | 'clear'

  const exportData = () => {
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nutritrack-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* הורדה חסומה בסביבה הזו */
    }
  };

  // אישור בתוך הדף (window.confirm לא זמין בכל סביבה)
  const confirmRow = (action) => (
    <div className="flex gap-2">
      <button className="btn-ghost flex-1" onClick={() => setConfirm(null)}>
        ביטול
      </button>
      <button
        className="btn flex-1 !bg-cal"
        onClick={() => {
          action();
          setConfirm(null);
        }}
      >
        כן, בטוח
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="px-1 text-[1.6rem] font-medium leading-tight">הגדרות</h1>

      <section className="card space-y-3">
        <h2 className="text-[15px] font-medium">יעדים יומיים</h2>
        <GoalsForm />
      </section>

      <section className="card space-y-2.5">
        <h2 className="text-[15px] font-medium">נתונים</h2>
        <p className="text-[11.5px] text-ink/65">כל הנתונים נשמרים על המכשיר הזה בלבד (localStorage).</p>
        <button className="btn-ghost w-full" onClick={exportData}>
          <Download size={17} /> ייצוא JSON
        </button>
        {confirm === 'reset' ? (
          confirmRow(resetDemo)
        ) : (
          <button className="btn-ghost w-full" onClick={() => setConfirm('reset')}>
            <RotateCcw size={17} /> טעינת נתוני דוגמה מחדש
          </button>
        )}
        {confirm === 'clear' ? (
          confirmRow(clearAll)
        ) : (
          <button className="btn-ghost w-full !text-cal" onClick={() => setConfirm('clear')}>
            <Trash2 size={17} /> מחיקת כל הנתונים
          </button>
        )}
        {confirm && <p className="text-center text-[11.5px] text-ink/65">{confirm === 'clear' ? 'כל הנתונים יימחקו ולא ניתן יהיה לשחזר אותם.' : 'הנתונים הנוכחיים יוחלפו בנתוני הדוגמה.'}</p>}
      </section>
    </div>
  );
}
