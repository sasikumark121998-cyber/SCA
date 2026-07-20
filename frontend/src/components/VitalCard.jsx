import { useState, useEffect } from 'react'
import { getVitalStatus } from '../data/vitals'

const MAX_DIGITS = {
  bp: 3,
  hr: 3,
  bc: 4,
  gl: 3,
}

export default function VitalCard({ def, value: initialValue, num: initialNum, gender, onChange }) {
  const Icon = def.icon
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [value, setValue] = useState(initialValue || '')
  const [num, setNum] = useState(initialNum || '')

  useEffect(() => {
    setValue(initialValue || '')
    setNum(initialNum || '')
  }, [initialValue, initialNum])

  const status = getVitalStatus(def.key, num, gender)

  const statusColor = {
    Low: 'bg-sky-500',
    Normal: 'bg-good',
    Medium: 'bg-amber-500',
    High: 'bg-bad',
  }[status] || 'bg-slate-300'

  const maxDigits = MAX_DIGITS[def.key] || 3

  const handleInputChange = (e) => {
    const val = e.target.value
    if (/^\d*\.?\d*$/.test(val)) {
      const digitsOnly = val.replace('.', '')
      if (digitsOnly.length <= maxDigits) {
        setInputVal(val)
      }
    }
  }

  const commitValue = () => {
    if (inputVal.trim() !== '') {
      const newValue = inputVal.trim()
      const numeric = parseFloat(inputVal)
      setValue(newValue)
      if (!isNaN(numeric)) setNum(numeric)
      onChange?.(def.key, newValue, isNaN(numeric) ? '' : numeric)
    }
    setEditing(false)
    setInputVal('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitValue()
    if (e.key === 'Escape') {
      setEditing(false)
      setInputVal('')
    }
  }

  return (
    <div className="bg-white rounded-xl2 shadow-soft p-[18px]">
      <div className="flex items-center gap-2 text-[13.5px] font-bold mb-1.5">
        <Icon className={`w-[17px] h-[17px] ${def.color}`} />
        <span>{def.label}</span>
      </div>
      <div className="text-[15.5px] text-faint mb-2.5 ">
        {value || '---/---'} {def.unit}
      </div>
      <div className="flex flex-col items-end gap-1 text-[11px] text-muted mb-3">
        <span className="flex items-center justify-start w-16">
          <i className="w-[7px] h-[7px] rounded-full bg-good mr-2"></i>
          <span>Normal</span>
        </span>

        <span className="flex items-center justify-start w-16">
          <i className="w-[7px] h-[7px] rounded-full bg-amber-500 mr-2"></i>
          <span>Medium</span>
        </span>

        <span className="flex items-center justify-start w-16">
          <i className="w-[7px] h-[7px] rounded-full bg-bad mr-2"></i>
          <span>High</span>
        </span>
      </div>

      {editing ? (
        <div className="flex justify-end gap-2.5 items-center">
          <input
            type="text"
            autoFocus
            value={inputVal}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 120"
            maxLength={maxDigits + 1}
            className="flex-1 px-2.5 py-2 rounded-lg border border-indigo-light text-[12.5px] outline-none"
          />
          <button
            onClick={commitValue}
            className="px-3 py-2 rounded-lg bg-indigo-light text-white text-[11.5px] font-semibold"
          >
            Set
          </button>
        </div>
      ) : (
        <div className="flex justify-end gap-2.5 items-center">
          <button
            onClick={() => setEditing(true)}
            className="flex-1 text-center py-2 rounded-lg border border-line text-[11.5px] font-semibold text-muted bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            Current
          </button>
          <div className={`w-[46px] h-16 rounded-lg flex flex-col items-center justify-center font-extrabold text-white text-base shrink-0 ${statusColor}`}>
            {num || '0'}
            <small className="text-[8.5px] font-semibold">{def.unit}</small>
          </div>
        </div>
      )}

      {status && (
        <div className="text-[11px] font-semibold text-center mt-2">
          Status: <span className={status === 'Normal' ? 'text-good' : status === 'High' ? 'text-bad' : 'text-amber-500'}>{status}</span>
        </div>
      )}
    </div>
  )
}