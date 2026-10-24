import { useState } from 'react';
import { BookOpen, Home, LineChart, Settings as Cog } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Diary from './components/Diary';
import Progress from './components/Progress';
import Settings from './components/Settings';

const TABS = [
  { id: 'dashboard', label: 'בית', icon: Home },
  { id: 'diary', label: 'יומן', icon: BookOpen },
  { id: 'progress', label: 'התקדמות', icon: LineChart },
  { id: 'settings', label: 'הגדרות', icon: Cog },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div dir="rtl" className="mx-auto flex h-full max-w-md flex-col bg-paper text-ink">
      <main className="flex-1 overflow-y-auto px-5 pb-32 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {tab === 'dashboard' && <Dashboard goDiary={() => setTab('diary')} />}
        {tab === 'diary' && <Diary />}
        {tab === 'progress' && <Progress />}
        {tab === 'settings' && <Settings />}
      </main>

      <nav className="fixed inset-x-5 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-[23rem] rounded-md border border-ink/[.15] bg-white/95  p-1.5 backdrop-blur">
        <ul className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <li key={id} className="flex-1">
                <button
                  onClick={() => setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full flex-col items-center gap-0.5 rounded-md py-2 text-[11px] font-semibold transition ${active ? 'bg-leaf text-paper' : 'text-ink/60'}`}
                >
                  <Icon size={19} strokeWidth={active ? 2.4 : 1.9} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
