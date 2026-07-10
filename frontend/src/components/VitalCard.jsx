export default function VitalCard({ def, value, num }) {
  const Icon = def.icon
  return (
    <div className="bg-white rounded-xl2 shadow-soft p-[18px]">
      <div className="flex items-center gap-2 text-[13.5px] font-bold mb-1.5">
        <Icon className={`w-[17px] h-[17px] ${def.color}`} />
        <span>{def.label}</span>
      </div>
      <div className="text-[15.5px] text-faint mb-2.5 " >
        {value || '---/---'} {def.unit}
      </div>
      <div className="flex flex-col items-end gap-1 text-[11px] text-muted mb-3">
        <span className="flex items-center justify-start w-16">
          <i className="w-[7px] h-[7px] rounded-full bg-good mr-2"></i>
          <span>Normal</span>
        </span>

        <span className="flex items-center justify-start w-16">
          <i className="w-[7px] h-[7px] rounded-full bg-bad mr-2"></i>
          <span>High</span>
        </span>
      </div>
      <div className="flex justify-end gap-2.5 items-center">
        <div className="w-24 text-center py-2 rounded-lg border border-line text-[11.5px] font-semibold text-muted bg-slate-50">
          Current
        </div>
        <div className="w-24 text-center py-2 rounded-lg border border-line text-[11.5px] font-semibold text-muted bg-slate-50">
          Baseline
        </div>
        <div className="w-[46px] h-16 border border-indigo-light rounded-lg flex flex-col items-center justify-center font-extrabold text-indigo text-base shrink-0">
          {num || '0'}
          <small className="text-[8.5px] font-semibold text-faint">{def.unit}</small>
        </div>
      </div>
    </div>
  )
}
