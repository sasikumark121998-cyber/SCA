import { Stethoscope, LogOut, UserPlus, FileBarChart2, ClipboardList, History as HistoryIcon, HelpCircle } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'create', label: 'Create Patient', icon: UserPlus },
  { key: 'results', label: 'Results', icon: FileBarChart2 },
  { key: 'prescription', label: 'Prescription', icon: ClipboardList },
  { key: 'history', label: 'History', icon: HistoryIcon },
  // { key: 'ai', label: 'AI Analysis' },
  { key: 'help', label: 'Help', icon: HelpCircle },
]

export default function Sidebar({ view, setView, onLogout }) {
  return (
    <div className="w-[250px] shrink-0 bg-gradient-to-b from-navy-dark to-navy-black text-white p-8 flex flex-col min-h-screen">
      <div className="flex flex-col items-center text-center mb-9">
        <div className="w-[92px] h-[92px] rounded-full bg-white flex items-center justify-center mb-3.5 shadow-lg">
          <Stethoscope className="w-11 h-11 text-indigo" strokeWidth={1.8} />
        </div>
        <div className="text-[19px] font-bold leading-tight">
          Smart Clinical
          <br />
          Advisor
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 mt-1.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`flex items-center gap-2.5 text-left px-[18px] py-3 rounded-xl text-[14.5px] font-semibold tracking-wide transition-colors ${
              view === item.key
                ? 'bg-white text-navy-dark'
                : 'text-indigo-100/80 text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-[17px] h-[17px] shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      <button
        title="Log out"
        onClick={onLogout}
        className="mt-auto self-center w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <LogOut className="w-5 h-5 text-navy-dark" />
      </button>
    </div>
  )
}