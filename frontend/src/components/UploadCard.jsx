import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function UploadCard({ label }) {
  const [fileName, setFileName] = useState(null)

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  return (
    <div className="relative bg-white rounded-xl2 shadow-soft p-[18px] text-center hover:-translate-y-0.5 transition-transform">
      <h4 className="text-[13.5px] font-bold text-left mb-5">{label}</h4>
      <label
        className={`w-14 h-14 rounded-full border-[2.5px] mx-auto mb-4 flex items-center justify-center cursor-pointer ${
          fileName ? 'border-good text-good' : 'border-slate-100 text-indigo-light'
        }`}
      >
        <Plus className="w-6 h-6" strokeWidth={2.4} />
        <input type="file" className="hidden" onChange={handleChange} />
      </label>
      {fileName ? (
        <div className="absolute bottom-3.5 left-[18px] right-[18px] text-left text-[10.5px] font-semibold text-good truncate">
          {fileName}
        </div>
      ) : (
        <div className="text-[11px] text-faint text-right">Page:</div>
      )}
    </div>
  )
}
