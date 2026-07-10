import { useState, useRef, useEffect } from 'react'
import { Folder, Plus } from 'lucide-react'

const SCAN_OPTIONS = ['X-ray', 'CT', 'MRI images']

export default function ScanImagesMenu() {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState({})
  const fileInputRef = useRef(null)
  const activeOption = useRef(null)
  const wrapRef = useRef(null)

  // close when clicking anywhere outside this card
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handlePick = (option) => {
    activeOption.current = option
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && activeOption.current) {
      setFiles((f) => ({ ...f, [activeOption.current]: file.name }))
    }
    e.target.value = ''
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full bg-white rounded-[18px] shadow-soft p-4 text-center"
    >
      <h4 className="text-[13.5px] font-bold text-left mb-5">Scan Images</h4>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full border-[2.5px] border-slate-100 mx-auto mb-4 flex items-center justify-center text-indigo-light hover:border-indigo-light transition-colors"
      >
        <Plus className="w-6 h-6" strokeWidth={2.4} />
      </button>

      <div className="text-[11px] text-faint text-right">Page:</div>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] w-full bg-white rounded-[18px] shadow-[0_20px_45px_rgba(43,35,120,0.28)] ring-1 ring-black/5 p-4 z-50 text-left">
          <h4 className="text-[14px] font-bold text-ink mb-3">Scan Images</h4>
          <div className="flex flex-col gap-2.5">
            {SCAN_OPTIONS.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => handlePick(option)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 text-[13px] text-ink hover:border-indigo-light hover:bg-slate-50 transition-colors"
              >
                <span className="truncate">{files[option] || option}</span>
                <Folder className="w-[17px] h-[17px] text-ink shrink-0" strokeWidth={1.8} />
              </button>
            ))}
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.dcm,.pdf"
        onChange={handleFileChange}
      />
    </div>
  )
}
