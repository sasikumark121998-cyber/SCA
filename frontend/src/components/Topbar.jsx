import { Search, Bell, Settings } from 'lucide-react'

export default function Topbar({ title }) {
  return (
    <div className="flex items-center gap-5 mb-7">
      <h1 className="text-[30px] font-extrabold text-indigo shrink-0 tracking-tight">{title}</h1>

      <div className="flex-1 max-w-[520px] flex items-center gap-2.5 bg-white rounded-2xl px-[18px] py-3 shadow-soft">
        <Search className="w-[18px] h-[18px] text-indigo shrink-0" />
        <input
          type="text"
          placeholder="Search"
          className="border-none outline-none flex-1 text-sm bg-transparent"
        />
      </div>

      <div className="flex items-center gap-3.5 ml-auto">
        <div className="flex items-center gap-2.5">
          <img
            src="https://i.pravatar.cc/100?img=47"
            alt="AI Diagnostic Assistant"
            className="w-[46px] h-[46px] rounded-full object-cover shadow-soft"
          />
          <div>
            <div className="text-sm font-bold text-ink">Smart Clinical Advisor</div>
            <div className="text-[11.5px] text-faint">AI Diagnostic Assistant</div>
          </div>
        </div>
      </div>
    </div>
  )
}
