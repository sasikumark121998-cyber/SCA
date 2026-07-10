import { Stethoscope, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'create', label: 'Create Patient' },
  { key: 'results', label: 'Results' },
  { key: 'prescription', label: 'Prescription' },
  { key: 'history', label: 'History' },
  // { key: 'ai', label: 'AI Analysis' },
  { key: 'help', label: 'Help' },
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
            className={`text-left px-[18px] py-3 rounded-xl text-[14.5px] font-semibold tracking-wide transition-colors ${
              view === item.key
                ? 'bg-white text-navy-dark'
                : 'text-indigo-100/80 text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
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
